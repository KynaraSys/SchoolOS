<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class SystemLogController extends Controller
{
    /**
     * Get recent system logs
     */
    public function index(Request $request)
    {
        $user = $request->user();
        \Illuminate\Support\Facades\Log::info("SystemLogController: User " . ($user ? $user->id : 'NULL') . " Roles: " . ($user ? implode(',', $user->getRoleNames()->toArray()) : 'None'));

        // access check: Super Admin (flag/role) OR ICT Admin (role) OR view_logs (permission)
        if (!$user->is_super_admin && 
            !$user->hasRole(['ICT Admin', 'Super Admin'], 'web') && 
            !$user->can('view_logs')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $logs = Activity::with('causer')
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'description' => $log->description,
                    'causer' => $log->causer ? $log->causer->name : 'System',
                    'created_at' => $log->created_at->diffForHumans(),
                    'properties' => $log->properties,
                ];
            });

        return response()->json($logs);
    }
    /**
     * Log a page visit
     */
    public function logVisit(Request $request)
    {
        $request->validate([
            'page' => 'required|string|max:255',
            'url' => 'required|string|max:1024',
        ]);

        activity()
            ->causedBy($request->user())
            ->withProperties([
                'ip' => $request->ip(),
                'url' => $request->url,
                'user_agent' => $request->userAgent(),
            ])
            ->log('Visited ' . $request->page);

        return response()->json(['message' => 'Logged']);
    }
}
