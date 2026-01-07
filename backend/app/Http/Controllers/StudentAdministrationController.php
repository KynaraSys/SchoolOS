<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Services\StudentDataService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class StudentAdministrationController extends Controller
{
    protected $dataService;

    public function __construct(StudentDataService $dataService)
    {
        $this->dataService = $dataService;
    }

    /**
     * Update Student Identity.
     */
    public function updateIdentity(Request $request, Student $student)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'other_names' => 'nullable|string|max:255',
            'dob' => 'sometimes|date',
            'gender' => 'sometimes|in:Male,Female',
            'birth_certificate_number' => 'nullable|string',
            'reason' => 'required|string|min:5',
        ]);

        $updatedStudent = $this->dataService->updateIdentity($student, $validated, $validated['reason']);

        return response()->json(['message' => 'Identity updated successfully', 'data' => $updatedStudent]);
    }

    /**
     * Update Student Placement.
     */
    public function updatePlacement(Request $request, Student $student)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'class_id' => 'sometimes|exists:classes,id',
            'stream' => 'nullable|string',
            'house' => 'nullable|string',
            'reason' => 'required|string|min:5',
        ]);

        $updatedStudent = $this->dataService->updatePlacement($student, $validated, $validated['reason']);

        return response()->json(['message' => 'Placement updated successfully', 'data' => $updatedStudent]);
    }

    /**
     * Update Student Guardians.
     */
    public function updateGuardians(Request $request, Student $student)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'guardian_ids' => 'required|array',
            'guardian_ids.*' => 'exists:guardians,id',
            'reason' => 'required|string|min:5',
        ]);

        $updatedStudent = $this->dataService->updateGuardians($student, $validated['guardian_ids'], $validated['reason']);

        return response()->json(['message' => 'Guardians updated successfully', 'data' => $updatedStudent->guardians]);
    }

    /**
     * Update Student Support details (Accessible by Teachers too).
     */
    public function updateSupport(Request $request, Student $student)
    {
        // Teachers can do this, so check permission appropriately
        if (!auth()->user()->can('update_student_support') && !auth()->user()->hasRole('Teacher')) {
            // Fallback for MVP: Allow Teachers and Admins
             $this->authorizeAdmin(); // Temporary strict check updates later
        }

        $validated = $request->validate([
            'special_needs' => 'nullable|string',
            'medical_notes' => 'nullable|string',
            'accommodation_notes' => 'nullable|string',
            'dietary_requirements' => 'nullable|string',
            'allergies' => 'nullable|string',
        ]);

        $updatedStudent = $this->dataService->updateSupport($student, $validated);

        return response()->json(['message' => 'Support details updated successfully', 'data' => $updatedStudent]);
    }

    protected function authorizeAdmin()
    {
        if (!auth()->user()->hasRole(['Admin', 'Super Admin', 'Principal'])) {
            abort(403, 'Unauthorized.');
        }
    }
}
