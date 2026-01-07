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

        // Optimized query: Fetch unread count as a subselect to avoid N+1 loop queries
        $conversations = Conversation::forUser($userId)
            ->with(['latestMessage', 'participants'])
            ->select('conversations.*')
            ->selectSub(function ($query) use ($userId) {
                // Count messages where created_at > (my last_read_at)
                // We need to join/lookup the pivot table for THIS conversation and THIS user
                // Pivot table: conversation_participants
                $query->selectRaw('count(*)')
                      ->from('messages')
                      ->whereColumn('messages.conversation_id', 'conversations.id')
                      ->whereRaw("messages.created_at > COALESCE((
                          SELECT last_read_at 
                          FROM conversation_participants 
                          WHERE conversation_participants.conversation_id = conversations.id 
                          AND conversation_participants.user_id = ?
                      ), '1970-01-01')", [$userId]);
            }, 'unread_count_calculated') // alias
            ->get()
            ->map(function ($conversation) use ($userId) {
                $otherParticipant = $conversation->participants->firstWhere('id', '!=', $userId);
                $me = $conversation->participants->firstWhere('id', $userId);
                
                $displayUser = $otherParticipant ?? Auth::user();

                $lastMessage = $conversation->latestMessage;

                return [
                    'id' => $conversation->id,
                    'type' => $conversation->type,
                    'user' => [
                        'id' => $displayUser->id,
                        'name' => $displayUser->name,
                        'role' => $displayUser->roles->first()->name ?? 'User',
                        'avatar' => $displayUser->profile_image,
                    ],
                    'last_message' => $lastMessage ? [
                        'content' => $lastMessage->content,
                        'created_at' => $lastMessage->created_at,
                        'is_own' => $lastMessage->sender_id === $userId,
                    ] : null,
                    'unread_count' => $conversation->unread_count_calculated, // Use the calculated value
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
                $q->where('name', 'ilike', "%{$query}%")
                  ->orWhere('email', 'ilike', "%{$query}%");
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
        
        $isUserLookup = request()->query('type') === 'user';
        $conversation = null;

        if (!$isUserLookup) {
            // Standard lookup by Conversation ID
            $conversation = Conversation::find($id);
        }

        if (!$conversation) {
           // Fallback or Explicit User Lookup:
           // Check if it's a User ID and find the DIRECT conversation
           $otherUserId = $id;
           $conversation = Conversation::where('type', 'direct')
               ->whereHas('participants', fn($q) => $q->where('user_id', $userId))
               ->whereHas('participants', fn($q) => $q->where('user_id', $otherUserId))
               ->first();
               
           if (!$conversation) {
               // If searching by User ID and no conversation exists, return empty array (valid new chat state)
               if ($isUserLookup) {
                    return response()->json([]);
               }
               // If searching by Conversation ID and not found, return empty or error.
               // Existing logic returned [] for fallback failure, let's keep it.
               return response()->json([]); 
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
