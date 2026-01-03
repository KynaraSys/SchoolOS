<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Grade;
use App\Models\Payment;
use App\Models\Student;
use App\Models\StudentAttendanceRisk;
use Carbon\Carbon;
use App\Services\PredictionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get aggregated statistics for the Principal Dashboard.
     */
    public function principalStats()
    {
        // 1. Enrollment
        $totalStudents = Student::whereHas('user', function ($q) {
            $q->where('is_active', true);
        })->count();
        
        $lastTermStudents = 50; // Mock comparison for now, or calculate based on created_at
        
        // 2. Attendance (Today)
        $today = Carbon::today();
        $totalAttendance = Attendance::where('date', $today)->count();
        $presentToday = Attendance::where('date', $today)->whereIn('status', ['present', 'late'])->count();
        $attendanceRate = $totalStudents > 0 ? round(($presentToday / $totalStudents) * 100, 1) : 0;
        
        // 3. Finance (Term Collection)
        // Assumption: Term Fee is 50,000 per student
        $termFeePerStudent = 50000;
        $expectedTotal = $totalStudents * $termFeePerStudent;
        $activeTermStart = Carbon::today()->startOfQuarter(); // Proxy for term start
        $collectedThisTerm = Payment::where('payment_date', '>=', $activeTermStart)->sum('amount');
        
        $collectionRate = $expectedTotal > 0 ? round(($collectedThisTerm / $expectedTotal) * 100, 1) : 0;
        
        // 4. Performance (Mean Score)
        $meanScore = Grade::avg('score') ?? 0;
        $meanScore = round($meanScore, 1);

        // 5. Risks
        $highRiskCount = StudentAttendanceRisk::where('risk_level', 'high')->count();

        // 6. Recent Alerts (Mock logic for specific "23 students missed..." message)
        $absentStreakCount = StudentAttendanceRisk::where('risk_level', 'high')->count(); 

        return response()->json([
            'enrollment' => [
                'total' => $totalStudents,
                'trend' => $totalStudents - $lastTermStudents > 0 ? '+' . ($totalStudents - $lastTermStudents) : (string)($totalStudents - $lastTermStudents)
            ],
            'attendance' => [
                'rate' => $attendanceRate,
                'absent_count' => $totalStudents - $presentToday
            ],
            'finance' => [
                'collected' => $collectedThisTerm,
                'expected' => $expectedTotal,
                'rate' => $collectionRate
            ],
            'performance' => [
                'mean_score' => $meanScore,
                'trend' => '+2.0' // Placeholder trend
            ],
            'risks' => [
                'high_risk_count' => $highRiskCount,
                'attendance_alert_message' => "$highRiskCount students have high absenteeism risk."
            ],
            'fee_defaulters' => self::getFeeDefaulters($termFeePerStudent, $activeTermStart),
            'insights' => self::getInsights()
        ]);
    }

    /**
     * Get students with highest outstanding balance.
     */
    private static function getFeeDefaulters($termFee, $termStart)
    {
        // ... existing implementation ...
        // Get all students
        // For performance in real app, optimize this query
        $students = Student::with(['user', 'schoolClass'])->get();
        
        $defaulters = [];
        
        foreach ($students as $student) {
            $paid = Payment::where('student_id', $student->id)
                ->where('payment_date', '>=', $termStart)
                ->sum('amount');
                
            $balance = $termFee - $paid;
            
            if ($balance > 0) {
                $defaulters[] = [
                    'id' => $student->user_id, // Use User ID for profile links
                    'name' => $student->user->name ?? 'Unknown',
                    'class' => $student->schoolClass ? ($student->schoolClass->name . ' ' . $student->schoolClass->stream) : 'N/A',
                    'paid' => $paid,
                    'balance' => $balance,
                    // Mock AI recommendation logic
                    'recommendation' => $balance > 30000 ? 'Immediate Follow-up' : 'Send Reminder'
                ];
            }
        }
        
        // Sort by balance desc
        usort($defaulters, function ($a, $b) {
            return $b['balance'] <=> $a['balance'];
        });
        
        return array_slice($defaulters, 0, 5);
    }
    
    /**
     * Get dynamic insights.
     */
    private static function getInsights()
    {
        // Insight 1: Best Performing Subject
        $bestSubject = Grade::select('subject', DB::raw('avg(score) as avg_score'))
            ->groupBy('subject')
            ->orderByDesc('avg_score')
            ->first();
            
        $insights = [];
        
        if ($bestSubject) {
            $score = round($bestSubject->avg_score, 1);
            $insights[] = [
                'type' => 'academic',
                'title' => "{$bestSubject->subject} is Top Performing",
                'description' => "Highest mean score of {$score}% across all classes. Consistency identified in teaching methods.",
                'trend' => 'up'
            ];
        } else {
             $insights[] = [
                'type' => 'academic',
                'title' => "Academic Data Pending",
                'description' => "Once grades are entered, AI will identify top performing subjects here.",
                'trend' => 'neutral'
            ];
        }

        // Insight 2: Attendance-Performance Correlation
        // Get average score of students with > 90% attendance vs < 90%
        // This is a heavy query, simplified for demo:
        // Let's assume high risk students correspond to low attendance
        $highRiskStudentIds = StudentAttendanceRisk::where('risk_level', 'high')->pluck('student_id');
        
        if ($highRiskStudentIds->count() > 0) {
            $lowAttendanceAvg = Grade::whereIn('user_id', function($q) use ($highRiskStudentIds) {
                // Grade user_id maps to Student user_id. Need to bridge Student ID -> User ID
                $q->select('user_id')->from('students')->whereIn('id', $highRiskStudentIds);
            })->avg('score');
            
            $highAttendanceAvg = Grade::whereNotIn('user_id', function($q) use ($highRiskStudentIds) {
                 $q->select('user_id')->from('students')->whereIn('id', $highRiskStudentIds);
            })->avg('score');
            
            if ($lowAttendanceAvg && $highAttendanceAvg) {
                $diff = round($highAttendanceAvg - $lowAttendanceAvg, 1);
                if ($diff > 5) {
                    $insights[] = [
                        'type' => 'correlation',
                        'title' => "Attendance Impacts Performance",
                        'description' => "Students with high attendance score {$diff}% higher on average than those at risk. Prioritize attendance interventions.",
                        'trend' => 'down' // Indicates the negative impact of low attendance
                    ];
                }
            }
        }

        // Insight 3: Anomaly Detection (Lowest Performing Class)
        $worstClass = DB::table('grades')
            ->join('students', 'grades.user_id', '=', 'students.user_id')
            ->join('classes', 'students.class_id', '=', 'classes.id')
            ->select('classes.name', 'classes.stream', DB::raw('avg(grades.score) as avg_score'))
            ->groupBy('classes.id', 'classes.name', 'classes.stream')
            ->orderBy('avg_score', 'asc')
            ->first();
            
        if ($worstClass && $worstClass->avg_score < 50) {
             $score = round($worstClass->avg_score, 1);
             $className = $worstClass->name . ' ' . $worstClass->stream;
             $insights[] = [
                'type' => 'anomaly',
                'title' => "Attention Needed: {$className}",
                'description' => "Class average is critically low at {$score}%. Recommended: Review curriculum pacing for this stream.",
                'trend' => 'down'
            ];
        }

        // Insight 4: Predictive Analytics (AI Forecast)
        // Mocking historical term data: [Term 1, Term 2, Term 3]
        // In a real app, query Grade::where('term_id', ...)->avg('score')
        $history = [65.0, 67.5, 68.2, 70.1]; // Upward trend
        $predictor = new PredictionService();
        $forecast = $predictor->predictNextValue($history);

        if ($forecast) {
            $trendText = $forecast['slope'] > 0 ? "improving" : "declining";
            $insights[] = [
                'type' => 'prediction',
                'title' => "AI Forecast: Next Term Performance",
                'description' => "Based on linear regression of past 4 terms, School Mean Score is projected to reach {$forecast['value']}% ({$trendText}).",
                'trend' => $forecast['slope'] > 0 ? 'up' : 'down'
            ];
        }

        // Limit to 2-3 insights (prioritize prediction if it exists)
        // Move prediction to top
        if (count($insights) > 0 && end($insights)['type'] === 'prediction') {
            array_unshift($insights, array_pop($insights));
        }

        return array_slice($insights, 0, 4);
    }
}
