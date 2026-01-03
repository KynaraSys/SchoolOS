<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Guardian;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GuardianStudentController extends Controller
{
    /**
     * Link a guardian to a student.
     */
    public function store(Request $request)
    {
        $request->validate([
            'guardian_id' => 'required|exists:guardians,id',
            'student_id' => 'required|exists:users,id',
            'relationship_type' => 'nullable|string',
            'is_primary' => 'boolean',
            'receives_sms' => 'boolean',
            'receives_email' => 'boolean',
            'receives_whatsapp' => 'boolean',
            'receives_portal' => 'boolean',
            'receives_calls' => 'boolean',
        ]);

        $guardian = Guardian::findOrFail($request->guardian_id);
        
        $this->authorize('update', $guardian);
        $student = User::findOrFail($request->student_id);

        // Check if already linked
        if ($guardian->students()->where('student_id', $student->id)->exists()) {
             return response()->json(['message' => 'Guardian is already linked to this student.'], 422);
        }

        // If this is the FIRST guardian, force is_primary = true
        $isFirstGuardian = $student->guardians()->count() == 0;
        $isPrimary = $isFirstGuardian ? true : ($request->is_primary ?? false);

        // If setting as primary, unset others for this student
        if ($isPrimary && !$isFirstGuardian) {
            $student->guardians()->updateExistingPivot(
                $student->guardians->pluck('id'), 
                ['is_primary' => false]
            );
        }

        $guardian->students()->attach($student->id, [
            'is_primary' => $isPrimary,
            'receives_sms' => $request->receives_sms ?? true,
            'receives_email' => $request->receives_email ?? false,
            'receives_whatsapp' => $request->receives_whatsapp ?? false,
            'receives_portal' => $request->receives_portal ?? true,
            'receives_calls' => $request->receives_calls ?? true,
        ]);

        // Log Activity
        \App\Models\Activity::create([
            'subject_type' => 'App\Models\User', // Student
            'subject_id' => $student->id,
            'causer_id' => auth()->id(),
            'description' => "Linked guardian {$guardian->first_name} to student",
        ]);

        return response()->json(['message' => 'Guardian linked successfully.', 'data' => $student->guardians()->get()]);
    }

    /**
     * Unlink a guardian from a student.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'guardian_id' => 'required|exists:guardians,id',
            'student_id' => 'required|exists:users,id',
        ]);

        $guardian = Guardian::findOrFail($request->guardian_id);
        
        $this->authorize('update', $guardian);
        $student = User::findOrFail($request->student_id);

        // Enforce Minimum 1 Guardian Rule
        $count = $student->guardians()->count();
        if ($count <= 1 && $student->guardians()->where('guardian_id', $guardian->id)->exists()) {
            return response()->json([
                'message' => 'Cannot unlink the only guardian. Every student must have at least one guardian.',
                'error_code' => 'MIN_ONE_GUARDIAN_REQUIRED'
            ], 422);
        }

        // Check Primary Guardian logic
        $pivot = $student->guardians()->where('guardian_id', $guardian->id)->first()->pivot;
        if ($pivot->is_primary) {
             return response()->json([
                 'message' => 'Cannot unlink the primary guardian. Please assign another guardian as primary first.',
                 'error_code' => 'CANNOT_UNLINK_PRIMARY'
             ], 422);
        }

        $guardian->students()->detach($student->id);

        // Log Activity
        \App\Models\Activity::create([
            'subject_type' => 'App\Models\User',
            'subject_id' => $student->id,
            'causer_id' => auth()->id(),
            'description' => "Unlinked guardian {$guardian->first_name} from student",
        ]);

        return response()->json(['message' => 'Guardian unlinked successfully.']);
    }

    /**
     * Update pivot data (e.g. set as primary).
     */
    public function update(Request $request, $guardianId, $studentId)
    {
        $guardian = Guardian::findOrFail($guardianId);
        
        $this->authorize('update', $guardian);

        $request->validate([
            'is_primary' => 'boolean',
            'receives_sms' => 'boolean',
            'receives_email' => 'boolean',
            'receives_whatsapp' => 'boolean',
            'receives_portal' => 'boolean',
            'receives_calls' => 'boolean',
        ]);

        $student = User::findOrFail($studentId); // Verify student exists

        // If setting to primary
        if ($request->has('is_primary') && $request->is_primary) {
            // Unset primary for all others
             $student->guardians()->updateExistingPivot(
                $student->guardians->pluck('id'), 
                ['is_primary' => false]
            );
        }

        $attributes = $request->only(['is_primary', 'receives_sms', 'receives_email', 'receives_whatsapp', 'receives_portal', 'receives_calls']);
        
        $student->guardians()->updateExistingPivot($guardianId, $attributes);

        // Log Activity
        \App\Models\Activity::create([
            'subject_type' => 'App\Models\User',
            'subject_id' => $student->id,
            'causer_id' => auth()->id(),
            'description' => "Updated guardian linkage for student",
            'properties' => $attributes
        ]);

        return response()->json(['message' => 'Guardian linkage updated.']);
    }
}
