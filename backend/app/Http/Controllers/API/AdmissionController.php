<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAdmissionRequest;
use App\Models\Student;
use App\Models\Guardian;
use App\Models\LearnerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdmissionController extends Controller
{
    /**
     * Store a newly created student admission in storage.
     */
    public function store(StoreAdmissionRequest $request)
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated) {
            // 1. Create Student
            // Generate Admission Number (Simple format: Year-Random)
            $admissionNumber = date('Y') . '-' . strtoupper(Str::random(6));
            
            // Allow for manual override if needed, otherwise generate
            // (In this logic we assume auto-gen for now as per prompt)

            $studentData = $validated['student'];
            $studentData['admission_number'] = $admissionNumber;
            $studentData['admission_status'] = 'Active'; // Default
            
            // Ensure we don't set user_id, adhering to "Student != User"
            
            $student = Student::create($studentData);

            // 2. Handle Guardians
            foreach ($validated['guardians'] as $guardianData) {
                $guardian = null;

                if (!empty($guardianData['guardian_id'])) {
                    $guardian = Guardian::find($guardianData['guardian_id']);
                } 
                
                if (!$guardian) {
                    // Create new Guardian
                    // Note: Guardian model might require unique email/phone.
                    // We use firstOrCreate to avoid duplicates if phone_number exists
                    $guardian = Guardian::firstOrCreate(
                        ['phone_number' => $guardianData['phone_number']],
                        [
                            'first_name' => $guardianData['first_name'],
                            'last_name' => $guardianData['last_name'],
                            'national_id' => $guardianData['national_id'] ?? null,
                            'email' => $guardianData['email'] ?? null,
                            // Set defaults
                            'is_active' => true,
                        ]
                    );
                }

                // Link to Student
                // Pivot table 'guardian_student'
                $student->guardians()->syncWithoutDetaching([
                    $guardian->id => [
                        'relationship_type' => $guardianData['relationship'], // This field name might need to match pivot column
                        // 'is_primary' => ... logic?
                    ]
                ]);
            }

            // 3. Initialize Learner Profile
            // Create an empty or partially filled profile
            $profile = new LearnerProfile([
                'student_id' => $student->id,
                // Any initial flags from admission context
            ]);
            $student->profile()->save($profile);

            return response()->json([
                'message' => 'Student admitted successfully',
                'student' => $student->load('guardians', 'profile'),
            ], 201);
        });
    }
}
