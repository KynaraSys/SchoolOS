<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Guardian;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function guardianActivities(Guardian $guardian)
    {
        // Simple audit log retrieval for this guardian
        $activities = Activity::where('subject_type', Guardian::class)
            ->where('subject_id', $guardian->id)
            ->with('causer')
            ->latest()
            ->get();
            
        // Also could include logs from related interactions if we logged them polymorphically differently
        
        return response()->json($activities);
    }
}
