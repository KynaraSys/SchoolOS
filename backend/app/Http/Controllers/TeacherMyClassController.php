<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
        
        Log::info('MyClass Request', [
            'user_id' => $user->id, 
            'assignment_found' => (bool)$assignment,
            'class_id' => $assignment?->schoolClass?->id ?? 'null',
            'students_count' => $assignment?->schoolClass?->students()->count() ?? 0
        ]);
        
        if (!$assignment) {
            return response()->json([
                'has_assignment' => false,
                'message' => 'No class assignment found'
            ], 200);
        }

        $schoolClass = $assignment->schoolClass;

        if (!$schoolClass) {
            return response()->json([
                'has_assignment' => false,
                'message' => 'Assigned class data not found'
            ], 200);
        }

        return response()->json([
            'has_assignment' => true,
            'class_details' => [
                'id' => $schoolClass->id,
                'name' => $schoolClass->name . ($schoolClass->stream ? ' ' . $schoolClass->stream : ''),
                'academic_year' => $assignment->academic_year,
                'student_count' => $schoolClass->students()->count(),
                'attendance_rate' => 95, // Mock for now until Attendance module
                'performance_avg' => 0, // Pending Exams Implementation
            ],
            'students' => $schoolClass->students()
                ->with(['profile']) // Optimize N+1
                ->get()
                ->map(function ($student) {
                    return [
                        'id' => $student->id,
                        'name' => $student->first_name . ' ' . $student->last_name,
                        'regNumber' => $student->admission_number,
                        'attendance' => 95, // Mock value
                        'competency' => 'Meeting', // Mock value or derive from assessments
                        'status' => 'Active',
                    ];
                })
        ]);
    }
}
