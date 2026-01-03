<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherMyClassController extends Controller
{
    /**
     * Get Overview of the assigned class.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user->isClassTeacher()) {
            return response()->json(['message' => 'Not a class teacher'], 403);
        }

        // For MVP, we get the first assigned class.
        // In reality, could be multiple, but usually one primary.
        $assignment = $user->classTeacherAssignments()->with('schoolClass')->first();
        
        if (!$assignment) {
             return response()->json(['message' => 'No class assignment found'], 404);
        }

        $schoolClass = $assignment->schoolClass;

        return response()->json([
            'class_details' => [
                'id' => $schoolClass->id,
                'name' => $schoolClass->name . ($schoolClass->stream ? ' ' . $schoolClass->stream : ''),
                'academic_year' => $assignment->academic_year,
                'student_count' => 0, // Pending Students Implementation
                'attendance_rate' => 0, // Pending Attendance Implementation
                'performance_avg' => 0, // Pending Exams Implementation
            ]
        ]);
    }
}
