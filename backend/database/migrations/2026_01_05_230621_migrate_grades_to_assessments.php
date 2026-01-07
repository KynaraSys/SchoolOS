<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Get default assessor (System Admin or First User)
        $assessorId = \Illuminate\Support\Facades\DB::table('users')->orderBy('id')->value('id') ?? 1;

        // 2. Get all legacy grades
        // Check if grades table exists first to avoid errors if already dropped
        if (!Schema::hasTable('grades')) {
            return;
        }

        $grades = \Illuminate\Support\Facades\DB::table('grades')->get();

        foreach ($grades as $grade) {
            // Find student ID from user_id (Grades linked to User, Assessments link to Student)
            $student = \Illuminate\Support\Facades\DB::table('students')->where('user_id', $grade->user_id)->first();
            
            if (!$student) {
                // Try to find if user_id was actually a student_id (wrong foreign key usage in legacy)
                $student = \Illuminate\Support\Facades\DB::table('students')->where('id', $grade->user_id)->first();
            }

            if (!$student) continue; // Skip if orphan

            // Resolve Subject
            $subjectId = $grade->subject_id ?? null;
            if (!$subjectId) {
                $subject = \Illuminate\Support\Facades\DB::table('subjects')->where('name', $grade->subject)->first();
                $subjectId = $subject ? $subject->id : null;
            }

            // Calculate Indicator
            $score = $grade->score;
            $indicator = $this->calculateIndicator($score);
            
            // Insert Assessment
            \Illuminate\Support\Facades\DB::table('assessments')->insert([
                'student_id' => $student->id,
                'subject_id' => $subjectId,
                'competency_id' => null, // Legacy grades were subject based
                'assessment_type' => 'hybrid',
                'tool_type' => 'written_test',
                'raw_score' => $score,
                'derived_indicator' => $indicator,
                'performance_level' => $indicator,
                'teacher_remarks' => 'Migrated from legacy ' . $grade->subject . ' grade.',
                'assessed_at' => $grade->created_at ?? now(),
                'assessor_id' => $assessorId,
                'evidence_paths' => json_encode([]),
                'created_at' => $grade->created_at ?? now(),
                'updated_at' => $grade->updated_at ?? now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Optional: Delete migrated assessments?
        // DB::table('assessments')->where('teacher_remarks', 'like', 'Migrated%')->delete();
    }

    private function calculateIndicator($score) 
    {
        if ($score >= 90) return 'EE1';
        if ($score >= 75) return 'EE2';
        if ($score >= 58) return 'ME1';
        if ($score >= 41) return 'ME2';
        if ($score >= 31) return 'AE1';
        if ($score >= 21) return 'AE2';
        if ($score >= 11) return 'BE1';
        return 'BE2';
    }
};
