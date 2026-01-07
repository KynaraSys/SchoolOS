<?php

namespace App\Services;

use App\Models\Remark;
use App\Models\User;
use App\Models\Student;
use App\Models\Term;
use Illuminate\Support\Facades\DB;
use Exception;

class RemarkService
{
    /**
     * Create a new remark with strict validation.
     *
     * @param User $author
     * @param array $data ['student_id', 'term_id', 'type', 'remark_text', 'title']
     * @return Remark
     * @throws Exception
     */
    public function createRemark(User $author, array $data)
    {
        $studentId = $data['student_id'];
        $termId = $data['term_id'];
        $type = $data['type'];
        
        // 1. Validate Use Permission based on Role and Type
        $this->authorizeAuthor($author, $type, $studentId);

        // 2. Validate Frequency Constraints
        $this->validateFrequency($studentId, $termId, $type);

        // 3. Determine Author Role String for Audit
        $authorRole = $this->determineAuthorRole($author, $type);

        return Remark::create([
            'student_id' => $studentId,
            'author_id' => $author->id,
            'term_id' => $termId,
            'type' => $type,
            'author_role' => $authorRole,
            'title' => $data['title'] ?? null,
            'remark_text' => $data['remark_text'],
            'status' => ($type === 'report') ? 'draft' : 'published', // Reports need approval
        ]);
    }

    /**
     * Check if author is allowed to write this type of remark.
     */
    protected function authorizeAuthor(User $author, string $type, int $studentId)
    {
        $student = Student::findOrFail($studentId);

        switch ($type) {
            case 'formative':
                // Subject Teacher can write formative remarks
                // Ideally check if they teach the student. Simplified check: Is a Teacher.
                if (!$author->hasRole('Teacher') && !$author->hasRole('Admin')) {
                    throw new Exception("Only teachers can write formative remarks.");
                }
                break;

            case 'profile':
                // Class Teacher ONLY
                // Strict check: Is this user the class teacher for this student's class?
                if (!$author->isClassTeacherFor($student->class_id) && !$author->hasRole('Admin')) { // Allow admin override
                    throw new Exception("Only the assigned Class Teacher can write Learner Profile remarks.");
                }
                break;

            case 'report':
                // Head Teacher / Principal ONLY
                if (!$author->hasRole('Principal') && !$author->hasRole('Head Teacher') && !$author->hasRole('Super Admin')) {
                    throw new Exception("Only the Head Teacher or Principal can write Official Report remarks.");
                }
                break;

            default:
                throw new Exception("Invalid remark type.");
        }
    }

    /**
     * Enforce strict frequency rules.
     */
    protected function validateFrequency(int $studentId, int $termId, string $type)
    {
        if ($type === 'formative') {
            return; // Unlimited
        }

        // Profile and Report remarks are ONE per term
        $exists = Remark::where('student_id', $studentId)
            ->where('term_id', $termId)
            ->where('type', $type)
            ->exists();

        if ($exists) {
            throw new Exception("A {$type} remark already exists for this learner in this term. Only one allowed.");
        }
    }

    protected function determineAuthorRole(User $author, string $type)
    {
        if ($type === 'profile') return 'class_teacher';
        if ($type === 'report') return 'head_teacher';
        return 'subject_teacher';
    }

    /**
     * Get remarks for a student, potentially filtered by term.
     */
    public function getStudentRemarks($studentId, $termId = null)
    {
        $query = Remark::where('student_id', $studentId)
            ->with('author:id,name') // Minimize author data
            ->latest();

        if ($termId) {
            $query->where('term_id', $termId);
        }

        return $query->get()->groupBy('type');
    }
}
