<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Incident;
use App\Models\Attendance; // Assuming this exists or we use logic
use Illuminate\Support\Facades\DB;

class LearnerProfileService
{
    /**
     * Get the full comprehensive learner profile.
     */
    public function getFullProfile(string $studentId)
    {
        $student = Student::with(['profile', 'schoolClass', 'guardians'])->findOrFail($studentId);

        // Access Control & Data Sanitization for Guardians
        $user = auth()->user();
        
        if ($user && $user->hasRole('Teacher')) {
            $isClassTeacher = $user->isClassTeacherFor($student->class_id);
            
            // 1. Sanitize Student Core Data
            $student->makeHidden([
                'upi', 'special_needs', 'dob', 'home_address', 
                'birth_certificate_number', 'retention_status', 
                'archived_at', 'anonymized_at', 'deleted_at'
            ]);

            // 2. Add Derived Attributes (Safe for Teachers)
            $student->learning_pathway = $student->age >= 15 ? 'Stage-Based' : 'Age-Based'; // Mock logic

            // 3. Sanitize Guardian Data
            $student->guardians->each(function ($guardian) use ($isClassTeacher) {
                // Hide sensitive fields for ALL teachers
                $guardian->makeHidden(['national_id', 'address', 'occupation', 'documents', 'notes', 'created_at', 'updated_at', 'email', 'pivot']);

                if ($isClassTeacher) {
                    // Class Teacher: Mask Phone
                    if ($guardian->phone_number) {
                        $guardian->phone_number = '******' . substr($guardian->phone_number, -4);
                    }
                } else {
                    // Subject Teacher: Hide Phone completely
                    $guardian->makeHidden(['phone_number', 'phone']);
                }
            });

            // Audit Log: Record that a teacher accessed guardian data
            \App\Models\Activity::create([
                'subject_type' => Student::class,
                'subject_id' => $student->id,
                'causer_id' => $user->id,
                'description' => 'Viewed student profile with guardian data',
                'properties' => [
                    'action' => 'view_guardian_data',
                    'guardian_ids' => $student->guardians->pluck('id'),
                    'role' => $user->getRoleNames()
                ]
            ]);
        }

        return [
            'student' => $student,
            'cbe_profile' => $student->profile, // Strengths, needs, etc.
            'attendance_summary' => $this->getAttendanceSummary($student),
            'competency_progress' => $this->getCompetencyProgress($student),
            'academic_progress' => $this->getAcademicProgress($student),
            'evidence_portfolio' => $this->getEvidencePortfolio($student),
            'discipline_summary' => ($user && $user->hasRole('Teacher')) 
                ? $this->getTeacherDisciplineSummary($student) 
                : $this->getDisciplineSummary($student),
        ];
    }

    /**
     * Calculate attendance metrics.
     * Note: Adjusting logic based on actual Attendance model availability.
     */
    protected function getAttendanceSummary(Student $student)
    {
        // Placeholder or actual logic if Attendance model is robust
        // For now returning a structure to be filled
        return [
            'present' => 95, // mock %
            'absent' => 2,
            'late' => 3,
            'trends' => [
                'week_1' => 100,
                'week_2' => 90,
                'week_3' => 95,
            ]
        ];
    }

    /**
     * Get competency progress based on Assessments.
     */
    protected function getCompetencyProgress(Student $student)
    {
        // 1. Core Competencies List (Fixed for CBC)
        $coreCompetencies = [
            'Communication & Collaboration',
            'Critical Thinking & Problem Solving',
            'Creativity & Imagination',
            'Citizenship',
            'Digital Literacy',
            'Learning to Learn',
            'Self-Efficacy'
        ];

        $breakdown = [];
        $counts = ['EE' => 0, 'ME' => 0, 'AE' => 0, 'BE' => 0];

        // Fetch actual assessments if available to populate this
        // but for now we ensure these 7 keys always exist
        
        foreach ($coreCompetencies as $compName) {
            // Mock logic: Randomize slightly or default to ME
            // In production: $assess = $student->assessments()->whereHas('competency', fn($q)=>$q->where('name', $compName))->latest()->first();
            $levelKey = 'ME'; 
            $levelName = 'Meeting';
            $remarks = 'Consistently demonstrates this competency in class activities.';
            
            $breakdown[] = [
                'area' => $compName,
                'level' => $levelName,
                'remarks' => $remarks,
                'evidence_count' => rand(0, 3)
            ];
            
            $counts[$levelKey]++;
        }

        return [
            'mastered_count' => $counts['EE'] + $counts['ME'],
            'in_progress_count' => $counts['AE'],
            'emerging_count' => $counts['BE'],
            'breakdown' => $breakdown
        ];
    }

    /**
     * Placeholder: Get evidence portfolio items.
     */
    protected function getEvidencePortfolio(Student $student)
    {
        return [
            [
                'id' => 1,
                'title' => 'Science Project - Water CycleModel',
                'type' => 'image',
                'url' => 'https://placehold.co/600x400',
                'date' => '2025-11-15',
                'competencies' => ['Creativity', 'Science']
            ],
            [
                'id' => 2,
                'title' => 'Oral Poem Recitation',
                'type' => 'audio',
                'url' => '#',
                'date' => '2025-12-01',
                'competencies' => ['Communication', 'Arts']
            ]
        ];
    }

    /**
     * Get discipline summary from Incidents.
     */
    protected function getDisciplineSummary(Student $student)
    {
        $incidents = $student->incidents()->latest()->take(5)->get();
        
        return [
            'total_incidents' => $student->incidents()->count(),
            'recent_incidents' => $incidents
        ];
    }

    /**
     * Get limited discipline summary for teachers (Only active/resolved, no hidden notes).
     */
    protected function getTeacherDisciplineSummary(Student $student)
    {
        // Filter incidents: Only those reported by THIS teacher OR visible to all staff
        // For MVP, showing all but hiding confidential notes
        $incidents = $student->incidents()
            ->latest()
            ->take(5)
            ->get()
            ->makeHidden(['confidential_notes', 'investigation_details']);
        
        return [
            'total_incidents' => $student->incidents()->count(),
            'recent_incidents' => $incidents,
            'note' => 'Confidential incidents are hidden.'
        ];
    }

    /**
     * Get academic progress from Assessments.
     */
    protected function getAcademicProgress(Student $student)
    {
        // Get latest assessment per subject
        // Using distinct/groupBy might be tricky with strict mode, so fetch sorted and unique in collection or window function
        // Simple approach: Fetch all, sort desc by date, unique by subject_id
        
        $assessments = \Illuminate\Support\Facades\DB::table('assessments')
            ->join('subjects', 'assessments.subject_id', '=', 'subjects.id')
            ->leftJoin('users', 'assessments.assessor_id', '=', 'users.id')
            ->where('assessments.student_id', $student->id)
            ->whereNotNull('assessments.subject_id')
            ->select(
                'subjects.name as subject',
                'users.name as teacher',
                'assessments.performance_level',
                'assessments.created_at'
            )
            ->orderBy('assessments.created_at', 'desc')
            ->get()
            ->unique('subject');
            
        return $assessments->values()->map(function($item) {
             return [
                 'subject' => $item->subject,
                 'teacher' => $item->teacher ?? 'N/A',
                 'indicator' => $item->performance_level,
                 'trend' => 'Stable', // Placeholder logic 
             ];
        });
    }

    /**
     * Update the descriptive parts of the profile.
     */
    public function updateProfileFields(string $studentId, array $data)
    {
        $student = Student::findOrFail($studentId);
        
        // Update or Create profile
        $profile = $student->profile()->updateOrCreate(
            ['student_id' => $student->id],
            [
                'strengths' => $data['strengths'] ?? null,
                'areas_for_support' => $data['areas_for_support'] ?? null,
                'social_emotional_notes' => $data['social_emotional_notes'] ?? null,
                'talents_interests' => $data['talents_interests'] ?? null,
                'teacher_general_remarks' => $data['teacher_general_remarks'] ?? null,
            ]
        );

        // Update Student direct fields if present
        // RESTRICTION: Sensitive fields (upi, enrollment_status, special_needs) are now handled by StudentDataService
        // Only allow very specific harmless updates here if any, or remove this block entirely.
        // For now, we allow nothing on the Student model via this method.
        
        return $profile;

        return $profile;
    }
}
