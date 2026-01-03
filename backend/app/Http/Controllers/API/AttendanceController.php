<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    /**
     * Get aggregated attendance overview for today.
     */
    public function overview()
    {
        $today = Carbon::today();
        
        $totalStudents = Student::count(); // Optimize: active students only?
        // Better: User::role('Student')->where('is_active', true)->count()
        $activeStudentsCount = User::role('Student')->where('is_active', true)->count();
        
        // Today's stats
        $attendances = Attendance::where('date', $today)->get();
        
        $present = $attendances->where('status', 'present')->count();
        $absent = $attendances->where('status', 'absent')->count();
        $late = $attendances->where('status', 'late')->count();
        $excused = $attendances->where('status', 'excused')->count();
        
        $markedCount = $attendances->count();
        $attendanceRate = $markedCount > 0 ? (($present + $late) / $markedCount) * 100 : 0; // Of those marked
        // OR: Rate of TOTAL active students? Usually "Attendance Rate" is Present / Total Enrollment.
        $realAttendanceRate = $activeStudentsCount > 0 ? (($present + $late) / $activeStudentsCount) * 100 : 0;

        // Class-wise breakdown
        $classes = SchoolClass::withCount(['students'])->get();
        $classStats = $classes->map(function ($class) use ($today) {
            $classPresences = Attendance::where('class_id', $class->id)
                ->where('date', $today)
                ->whereIn('status', ['present', 'late'])
                ->count();
            
            // Total students in class
            // Note: student count on class model is via students()
            $total = $class->students_count;
            
            return [
                'id' => $class->id,
                'class' => $class->name . ' ' . $class->stream,
                'present' => $classPresences,
                'total' => $total,
                'percentage' => $total > 0 ? round(($classPresences / $total) * 100, 1) : 0
            ];
        });

        // Recent Absences (Today)
        $absentees = Attendance::with(['student.user', 'schoolClass'])
            ->where('date', $today)
            ->whereIn('status', ['absent', 'excused'])
            ->get()
            ->map(function ($att) {
                // Calculate streak? Expensive... simple for now. 
                // Maybe just assume 1 unless we query deeper.
                return [
                    'id' => $att->student_id,
                    'name' => $att->student->user->name ?? 'Unknown',
                    'class' => $att->schoolClass->name . ' ' . $att->schoolClass->stream,
                    'status' => $att->status, // absent vs excused
                    'days' => 1 // Placeholder for streak
                ];
            });

        // High Risk Students
        $highRiskStudents = \App\Models\StudentAttendanceRisk::with(['student.user', 'student.schoolClass'])
            ->where('risk_level', 'high')
            ->orderByDesc('risk_score')
            ->limit(10)
            ->get()
            ->map(function ($risk) {
                if (!$risk->student) return null; // Skip orphaned records
                return [
                    'id' => $risk->student_id,
                    'name' => $risk->student->user->name ?? 'Unknown',
                    'class' => $risk->student->schoolClass ? ($risk->student->schoolClass->name . ' ' . $risk->student->schoolClass->stream) : 'N/A',
                    'risk_score' => $risk->risk_score,
                    'risk_level' => $risk->risk_level,
                ];
            })
            ->filter(); // Remove nulls
            
        $highRiskCount = \App\Models\StudentAttendanceRisk::where('risk_level', 'high')->count();

        // Term Average (Last 90 Days)
        // Optimization: Cache this query if it becomes heavy
        $termStartDate = Carbon::today()->subDays(90);
        $termStats = Attendance::where('date', '>=', $termStartDate)
            ->selectRaw("count(*) as total, sum(case when status in ('present', 'late') then 1 else 0 end) as present")
            ->first();
            
        $termAverage = $termStats->total > 0 
            ? round(($termStats->present / $termStats->total) * 100, 1) 
            : 0;

        return response()->json([
            'total_students' => $activeStudentsCount,
            'present_count' => $present + $late,
            'absent_count' => $absent + $excused,
            'attendance_rate' => round($realAttendanceRate, 1),
            'term_average' => $termAverage,
            'class_stats' => $classStats,
            'absentees' => $absentees,
            'high_risk_count' => $highRiskCount,
            'high_risk_students' => $highRiskStudents
        ]);
    }

    /**
     * Get attendance sheet for a specific class and date.
     */
    public function showClass(Request $request, $classId)
    {
        $date = $request->query('date', Carbon::today()->toDateString());
        
        $class = SchoolClass::findOrFail($classId);
        
        // Get all students in class
        $students = Student::with('user')
            ->where('class_id', $classId)
            ->get()
            ->map(function ($student) use ($classId, $date) {
                // Check if attendance exists
                $attendance = Attendance::where('student_id', $student->id)
                    ->where('date', $date)
                    ->first();
                
                return [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'adm' => $student->admission_number,
                    'status' => $attendance ? $attendance->status : null, // null = not marked
                    'remarks' => $attendance ? $attendance->remarks : '',
                ];
            });
            
        return response()->json([
            'class' => $class->name . ' ' . $class->stream,
            'date' => $date,
            'students' => $students
        ]);
    }

    /**
     * Store/Update attendance
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:present,absent,late,excused',
            'attendances.*.remarks' => 'nullable|string'
        ]);

        $date = $validated['date'];
        $classId = $validated['class_id'];
        $userId = auth()->id(); // Marker

        DB::transaction(function () use ($validated, $date, $classId, $userId) {
            foreach ($validated['attendances'] as $data) {
                Attendance::updateOrCreate(
                    [
                        'student_id' => $data['student_id'],
                        'date' => $date
                    ],
                    [
                        'class_id' => $classId,
                        'status' => $data['status'],
                        'remarks' => $data['remarks'] ?? null,
                        'marked_by' => $userId,
                        'marked_at' => now(),
                    ]
                );
            }
        });

        // Optional: Trigger Risk Check Job here?
        // Artisan::call('attendance:calculate-risk', ['--class_id' => $classId]);

        return response()->json(['message' => 'Attendance marked successfully']);
    }
}
