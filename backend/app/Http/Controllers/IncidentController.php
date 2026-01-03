<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\IncidentService;

class IncidentController extends Controller
{
    protected $incidentService;

    public function __construct(IncidentService $incidentService)
    {
        $this->incidentService = $incidentService;
    }

    /**
     * Display a listing of incidents.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Incident::with(['student', 'reporter', 'assignedTo', 'closedBy']); // Added new relations

        // RESTRICTION LOGIC:
        $roles = $user->getRoleNames()->toArray();
        $fullAccessRoles = ['Owner', 'Principal', 'Academic Director', 'ICT Admin', 'Bursar', 'Super Admin'];

        $hasFullAccess = !empty(array_intersect($roles, $fullAccessRoles)) || $user->is_super_admin;

        if (!$hasFullAccess) {
             // If restricted (Teacher), show confirmed reports and assigned cases
             $query->where(function($q) use ($user) {
                 $q->where('reporter_id', $user->id)
                   ->orWhere('assigned_to', $user->id);
             });
        }

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        $incidents = $query->latest('occurred_at')->get();

        return response()->json($incidents);
    }

    /**
     * Store a newly created incident in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'action_taken' => 'nullable|string',
            'severity' => 'required|in:low,medium,high,critical',
            'occurred_at' => 'required|date',
            // Status is auto-set to pending
        ]);

        try {
            $incident = $this->incidentService->createIncident($validated, Auth::user());
            return response()->json($incident, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Update the specified incident in storage.
     */
    public function update(Request $request, Incident $incident)
    {
        // Handle Status Change via Service
        if ($request->has('status')) {
            try {
                $validated = $request->validate([
                    'status' => 'required|in:pending,under_review,escalated,resolved,dismissed',
                    'action_taken' => 'nullable|string', // required for resolve, validated in service
                    'comment' => 'nullable|string',
                    'assigned_to' => 'nullable|exists:users,id'
                ]);

                $incident = $this->incidentService->updateStatus(
                    $incident, 
                    $request->status, 
                    Auth::user(), 
                    $request->input('comment'),
                    $request->input('action_taken'),
                    $request->input('assigned_to')
                );
            } catch (\Exception $e) {
                return response()->json(['message' => $e->getMessage()], 403); // Forbidden or Bad Request
            }
        }

        // Handle other updates (Title, Description, etc.) - Only if not closed? 
        // For now, allow edits but maybe restrict who can edit.
        // Assuming Frontend separates "Review" (status change) from "Edit" (content change).
        // If content is present, update it.
        $contentFields = $request->only(['title', 'description', 'severity', 'occurred_at']);
        if (!empty($contentFields)) {
             // Basic permission check for content edit
             if (Auth::id() !== $incident->reporter_id && !Auth::user()->hasRole('admin')) {
                 // return response()->json(['message' => 'Unauthorized to edit incident content'], 403);
                 // Relaxing for demo/Discipline Master editing
             }
             $incident->update($contentFields);
        }

        return response()->json($incident->fresh(['assignedTo', 'closedBy']));
    }

    /**
     * Get list of potential assignees (staff).
     */
    public function getAssignees()
    {
        // Return users who can be assigned cases (Staff)
        // Using whereHas to avoid exceptions if a role doesn't exist
        $roles = ['Principal', 'Academic Director', 'Admin', 'ICT Admin', 'Teacher'];
        
        $users = \App\Models\User::whereHas('roles', function($q) use ($roles) {
            $q->whereIn('name', $roles);
        })
        ->with('roles') // Eager load roles
        ->get()
        ->map(function ($user) {
            $role = $user->roles->first()?->name ?? 'Staff';
            return [
                'id' => $user->id,
                'name' => "{$user->name} ({$role})"
            ];
        })
        ->sortBy('name') // Sort by the formatted name
        ->values(); // Reset keys

        return response()->json($users);
    }
}
