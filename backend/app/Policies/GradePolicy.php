<?php

namespace App\Policies;

use App\Models\Grade;
use App\Models\User;

class GradePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Teachers and Admins can view all grades
        return $user->hasRole(['Teacher', 'Admin']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Grade $grade): bool
    {
        if ($user->hasRole(['Admin', 'ICT Admin', 'Principal'])) {
            return true;
        }

        // Teachers: Can only view grades if they teach that Subject to that Class
        // OR if they are the Class Teacher (Overseer of the report card)
        if ($user->hasRole('Teacher')) {
            // Check by Grade context (Class/Subject)
            if ($user->isClassTeacherFor($grade->class_id)) {
                return true;
            }

            return $user->teachesSubjectInClass($grade->subject_id, $grade->class_id);
        }

        // Students/Parents: Own grades only
        return $user->id === $grade->student->user_id || 
               ($user->hasRole('Parent') && $user->guardians()->whereHas('students', fn($q) => $q->where('id', $grade->student_id))->exists());
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Creation logic usually tied to Controller validation of subject/class, 
        // but generally Teachers can create.
        return $user->hasRole(['Admin', 'Teacher']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Grade $grade): bool
    {
        if ($user->hasRole(['Admin', 'ICT Admin'])) {
            return true;
        }

        if ($user->hasRole('Teacher')) {
            // Strict: Only Subject Teacher can edit.
            return $user->teachesSubjectInClass($grade->subject_id, $grade->class_id);
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Grade $grade): bool
    {
        return $this->update($user, $grade);
    }
}
