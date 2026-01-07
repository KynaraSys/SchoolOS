<?php

namespace App\Http\Controllers;

use App\Services\LearnerProfileService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LearnerProfileController extends Controller
{
    protected $profileService;

    public function __construct(LearnerProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    /**
     * Get the learner profile for a specific student.
     */
    public function show($detail)
    {
        // $detail here is likely the student ID because of how the route will be defined
        // We will define route as /learners/{id}/profile
        
        $profile = $this->profileService->getFullProfile($detail);

        return response()->json($profile);
    }

    /**
     * Update learner profile details.
     */
    public function update(Request $request, $id)
    {
        // basic validation
        $validated = $request->validate([
            'strengths' => 'nullable|string',
            'areas_for_support' => 'nullable|string',
            'social_emotional_notes' => 'nullable|string',
            'talents_interests' => 'nullable|string',
            'teacher_general_remarks' => 'nullable|string',
            // Restricted fields removed
            // 'upi', 'special_needs' are now handled by StudentDataService
        ]);

        $profile = $this->profileService->updateProfileFields($id, $validated);

        return response()->json(['message' => 'Profile updated successfully', 'data' => $profile]);
    }
}
