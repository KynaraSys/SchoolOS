<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\StudentAttendanceRisk;
use App\Models\Term;
use Carbon\Carbon;

class AttendanceRiskService
{
    /**
     * Calculate and update risk for a student in a specific term.
     */
    public function calculateRisk(Student $student, ?Term $term = null): StudentAttendanceRisk
    {
        if (!$term) {
            // Find current term or latest term
            $term = Term::where('start_date', '<=', now())
                ->where('end_date', '>=', now())
                ->first();
            
            if (!$term) {
                // Fallback to latest term if no active term
                $term = Term::latest('end_date')->first();
            }
        }

        if (!$term) {
             throw new \Exception("No term found to calculate risk against.");
        }

        // Fetch attendances for this term
        $attendances = Attendance::where('student_id', $student->id)
            ->whereBetween('date', [$term->start_date, $term->end_date])
            ->where('date', '<=', now()) // Don't count future if exists
            ->orderBy('date', 'desc')
            ->get();

        $totalSessions = $attendances->count();
        if ($totalSessions === 0) {
            // No data, low risk
            return $this->saveRisk($student, $term, 0, 'low', []);
        }

        // Metrics
        $unexcusedAbsences = $attendances->where('status', 'absent')->count();
        $excusedAbsences = $attendances->where('status', 'excused')->count();
        $lates = $attendances->where('status', 'late')->count();
        $presentOrLate = $attendances->whereIn('status', ['present', 'late'])->count();

        // Calculate Scores
        $score = 0;
        $score += ($unexcusedAbsences * 5);
        $score += ($excusedAbsences * 3);
        $score += ($lates * 2);

        // Consecutive Absences (Current Streak)
        $streak = 0;
        foreach ($attendances as $att) {
            if (in_array($att->status, ['absent', 'excused'])) {
                $streak++;
            } else {
                break;
            }
        }
        
        if ($streak > 2) {
            $score += ($streak - 2) * 8;
        }

        // Percentage Logic
        $attendancePct = ($presentOrLate / $totalSessions) * 100;
        if ($attendancePct < 75) {
            $score += 25; // 10 + 15
        } elseif ($attendancePct < 85) {
            $score += 10;
        }

        // Trend Logic
        // Compare recent 5 days vs overall
        $trendAdjustment = 0;
        $trendDescription = 'stable';
        
        if ($totalSessions >= 10) {
            $recent5 = $attendances->take(5);
            $recentPresent = $recent5->whereIn('status', ['present', 'late'])->count();
            $recentPct = ($recentPresent / 5) * 100;

            // Simple delta
            $diff = $recentPct - $attendancePct;

            if ($diff < -10) {
                // Recent is much worse than average -> Declining
                $trendAdjustment = 10;
                $trendDescription = 'declining';
            } elseif ($diff > 10) {
                // Recent is much better -> Improving
                $trendAdjustment = -10;
                $trendDescription = 'improving';
            }
        }
        
        $score += $trendAdjustment;

        // Cap score
        $score = max(0, min(100, $score));

        // Determine Level
        $level = 'low';
        if ($score > 60) $level = 'high';
        elseif ($score > 30) $level = 'medium';

        // Factors for explainability
        $factors = [
            'unexcused_absences' => $unexcusedAbsences,
            'excused_absences' => $excusedAbsences,
            'consecutive_absences' => $streak,
            'lates' => $lates,
            'attendance_percentage' => round($attendancePct, 1) . '%',
            'trend' => $trendDescription,
            'total_days' => $totalSessions
        ];

        return $this->saveRisk($student, $term, $score, $level, $factors);
    }

    protected function saveRisk(Student $student, Term $term, int $score, string $level, array $factors)
    {
        return StudentAttendanceRisk::updateOrCreate(
            [
                'student_id' => $student->id, 
                'term_id' => $term->id
            ],
            [
                'risk_score' => $score,
                'risk_level' => $level,
                'primary_factors' => $factors,
                'last_evaluated_at' => now(),
            ]
        );
    }
}
