<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;

class LearnerRetentionController extends Controller
{
    /**
     * Archive the specified student.
     */
    public function archive(Request $request, Student $student)
    {
        // Permission check
        if (!auth()->user()->can('manage retention')) { // Or simplified role check if permissions not fully set up
             // Fallback for now if permissions strictly not named this
             if (!auth()->user()->hasRole(['Super Admin', 'Admin', 'ICT Admin'])) {
                 return response()->json(['message' => 'Unauthorized capability.'], 403);
             }
        }

        if ($student->archived_at) {
            return response()->json(['message' => 'Student is already archived.'], 409);
        }

        $student->archive();

        return response()->json([
            'message' => 'Student archived successfully.',
            'student' => $student->refresh()->load('schoolClass')
        ]);
    }

    /**
     * Anonymize the specified student.
     */
    public function anonymize(Request $request, Student $student)
    {
         if (!auth()->user()->hasRole(['Super Admin', 'ICT Admin'])) {
             return response()->json(['message' => 'Unauthorized. High privillege required.'], 403);
         }

         if ($student->anonymized_at) {
             return response()->json(['message' => 'Student is already anonymized.'], 409);
         }

         // Ensure archived first or just do it? Policy says Long-Term Alumni.
         // We'll allow direct anonymization for privacy requests, but typically after archive.
         $student->anonymize();

         return response()->json([
             'message' => 'Student records anonymized.',
             'student' => $student->refresh()
         ]);
    }

    /**
     * Remove the specified student (Soft Delete).
     */
    public function destroy(Student $student)
    {
        if (!auth()->user()->hasRole(['Super Admin', 'Admin'])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $student->delete(); // Soft delete

        return response()->json(['message' => 'Student deleted (soft).']);
    }

    /**
     * Restore a soft-deleted or archived student.
     */
    public function restore($id)
    {
        if (!auth()->user()->hasRole(['Super Admin'])) {
             return response()->json(['message' => 'Unauthorized. Super Admin required to restore.'], 403);
        }

        $student = Student::withTrashed()->find($id);

        if (!$student) {
            return response()->json(['message' => 'Student not found.'], 404);
        }

        if ($student->trashed()) {
            $student->restore();
        }

        if ($student->archived_at || $student->anonymized_at) {
            $student->restoreFromArchive();
        }

        return response()->json([
            'message' => 'Student record restored.',
            'student' => $student->refresh()
        ]);
    }
}
