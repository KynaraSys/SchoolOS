<?php

namespace App\Policies;

use App\Models\Student;
use App\Models\User;

class StudentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['Admin', 'ICT Admin', 'Principal', 'Teacher', 'Bursar', 'Secretary']);
    }

    /**
     * Determine whether the user can view the model.
     * Strict Least Privilege:
     * - Admins: Yes
     * - Class Teacher: Yes (for their class)
     * - Subject Teacher: Yes (for their class)
     * - Parent: Yes (if linked)
     */
    public function view(User $user, Student $student): bool
    {
        if ($user->hasRole(['Admin', 'ICT Admin', 'Principal'])) {
            return true;
        }

        // Class Teacher / Subject Teacher Check
        if ($user->hasRole('Teacher')) {
            return $user->teachesClass($student->class_id);
        }

        // Parent Check
        if ($user->hasRole('Parent')) {
            return $user->guardians()->whereHas('students', function ($q) use ($student) {
                $q->where('students.id', $student->id);
            })->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['Admin', 'ICT Admin', 'Admissions Officer']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Student $student): bool
    {
        return $user->hasRole(['Admin', 'ICT Admin', 'Admissions Officer']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Student $student): bool
    {
        return $user->hasRole(['Admin']);
    }
}
