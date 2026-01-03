<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Get list of conversations.
     */
    public function index()
    {
        $userId = Auth::id();
        
        $conversations = Conversation::forUser($userId)
            ->with(['latestMessage', 'participants'])
            ->get()
            ->map(function ($conversation) use ($userId) {
                $otherParticipant = $conversation->participants->firstWhere('id', '!=', $userId);
                $me = $conversation->participants->firstWhere('id', $userId);
                
                // If it's a group, we might handle display differently, but for direct, get the other user.
                // Fallback for self-chat or broken data
                $displayUser = $otherParticipant ?? Auth::user();

                $lastMessage = $conversation->latestMessage;
                
                // Calculate unread: If message created AFTER my last_read_at
                $lastRead = $me->pivot->last_read_at ?? null;
                $unreadCount = 0;
                
                if ($lastMessage && (!$lastRead || $lastMessage->created_at > $lastRead)) {
                    // This is a rough count. Ideally count messages > lastRead.
                    // For performance, we can do a subquery or just boolean "has unread".
                    // Let's do a strict count.
                    $unreadCount = $conversation->messages()
                        ->where('created_at', '>', $lastRead ?? '1970-01-01')
                        ->count();
                }

                return [
                    'id' => $conversation->id,
                    'type' => $conversation->type,
                    'user' => [ // Kept 'user' key for frontend compatibility where possible
                        'id' => $displayUser->id,
                        'name' => $displayUser->name,
                        'role' => $displayUser->roles->first()->name ?? 'User',
                        'avatar' => $displayUser->profile_image, // If available
                    ],
                    'last_message' => $lastMessage ? [
                        'content' => $lastMessage->content,
                        'created_at' => $lastMessage->created_at,
                        'is_own' => $lastMessage->sender_id === $userId,
                    ] : null,
                    'unread_count' => $unreadCount,
                    'updated_at' => $conversation->updated_at,
                ];
            })
            ->sortByDesc('updated_at')
            ->values();

        return response()->json($conversations);
    }

    /**
     * Get total unread count for badge.
     */
    public function unreadCount()
    {
        $userId = Auth::id();
        // Complex query: Sum of messages in user's conversations where created_at > user's pivot last_read_at.
        // Simplified: User can just poll 'index' if n is small, but for badge we want specific number.
        
        // This query joins participants -> conversations -> messages
        $count = DB::table('conversation_participants as cp')
            ->join('messages as m', 'm.conversation_id', '=', 'cp.conversation_id')
            ->where('cp.user_id', $userId)
            ->whereRaw("m.created_at > COALESCE(cp.last_read_at, '1970-01-01')")
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Search for users to chat with.
     */
    public function searchUsers(Request $request)
    {
        $query = $request->get('query');
        $currentUser = Auth::user();
        $currentUserId = $currentUser->id;

        // Base query
        $usersQuery = User::where('id', '!=', $currentUserId);

        if (!empty($query)) {
            $usersQuery->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            });
        } else {
             $usersQuery->orderBy('name', 'asc')->take(20);
        }

        // Apply Permission Logic Filtering
        // It's hard to apply complex 'canMessage' PHP logic to SQL query efficiently without advanced scopes.
        // We will fetch candidate users (limit 20 or 50) and then filter them in PHP.
        // This assumes the search result set is small enough to filter.
        
        $candidates = $usersQuery->take(50)->get(); // Limit to 50 for performance

        $validUsers = $candidates->filter(function ($user) use ($currentUser) {
            return $currentUser->canMessage($user);
        })->values()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->roles->first()->name ?? 'User',
            ];
        });

        return response()->json($validUsers);
    }

    /**
     * Get messages for a conversation.
     * Param: $conversationId (previously userId, now we accept userId OR conversationId? 
     * To keep frontend simple transition, we might need to look up conversation by userId if generic ID passed)
     * BUT for v2, we should use conversation IDs.
     * However, frontend "ChatWindow" receives "user".
     * Let's support: Show messages by CONVERSATION ID.
     * Does Frontend know Conversation ID? Yes, list returns it.
     */
    public function show($id)
    {
        $userId = Auth::id();
        
        // Check if $id is a Conversation ID or User ID.
        // If it's a conversation, check access.
        $conversation = Conversation::find($id);

        if (!$conversation) {
           // Fallback: Check if it's a User ID and find the DIRECT conversation
           // This helps migration from old API calls if any exist
           $otherUserId = $id;
           $conversation = Conversation::where('type', 'direct')
               ->whereHas('participants', fn($q) => $q->where('user_id', $userId))
               ->whereHas('participants', fn($q) => $q->where('user_id', $otherUserId))
               ->first();
               
           if (!$conversation) {
               return response()->json([]); // No conversation yet
           }
        }

        // Verify participation
        if (!$conversation->participants()->where('user_id', $userId)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $messages = $conversation->messages()
            ->with('sender:id,name')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    /**
     * Send a new message.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            // 'conversation_id' OR 'recipient_id' required
            'conversation_id' => 'required_without:recipient_id|exists:conversations,id',
            'recipient_id' => 'required_without:conversation_id|exists:users,id',
            'context_type' => 'nullable|string',
            'context_id' => 'nullable|integer',
        ]);

        $userId = Auth::id();
        $conversation = null;

        if ($request->has('conversation_id')) {
            $conversation = Conversation::find($request->conversation_id);
            // Verify access
             if (!$conversation->participants()->where('user_id', $userId)->exists()) {
                 return response()->json(['error' => 'Unauthorized'], 403);
             }
        } elseif ($request->has('recipient_id')) {
            // Find or Create Direct Conversation
            $recipientId = $request->recipient_id;
            
            // Check Permissions
            $recipient = User::find($recipientId);
            if (!Auth::user()->canMessage($recipient)) {
                return response()->json(['error' => 'You are not valid to message this user.'], 403);
            }

            // Check existence
            $conversation = Conversation::where('type', 'direct')
               ->whereHas('participants', fn($q) => $q->where('user_id', $userId))
               ->whereHas('participants', fn($q) => $q->where('user_id', $recipientId))
               ->first();
            
            if (!$conversation) {
                // Create
                DB::transaction(function() use (&$conversation, $userId, $recipientId) {
                    $conversation = Conversation::create(['type' => 'direct']);
                    $conversation->participants()->attach([$userId, $recipientId]);
                });
            }
        }

        // Create Message
        $message = $conversation->messages()->create([
            'sender_id' => $userId,
            'content' => $request->content,
            'context_type' => $request->context_type,
            'context_id' => $request->context_id,
        ]);
        
        $conversation->touch(); // Update updated_at

        return response()->json($message->load('sender'), 201);
    }

    /**
     * Mark conversation as read
     */
    public function markRead($id)
    {
        $userId = Auth::id();
        
        // Logic similar to show: resolve conversation
         $conversation = Conversation::find($id);
         if (!$conversation) { 
             // Fallback for User ID
             $otherUserId = $id;
             $conversation = Conversation::where('type', 'direct')
               ->whereHas('participants', fn($q) => $q->where('user_id', $userId))
               ->whereHas('participants', fn($q) => $q->where('user_id', $otherUserId))
               ->first();
         }

        if ($conversation) {
            $conversation->participants()->updateExistingPivot($userId, [
                'last_read_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Marked as read']);
    }
}
