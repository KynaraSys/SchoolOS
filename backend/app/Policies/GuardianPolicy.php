<?php

namespace App\Policies;

use App\Models\Guardian;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class GuardianPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // STRICT: Only administrative roles can view the full directory
        return $user->hasRole(['Admin', 'ICT Admin', 'Principal', 'Deputy Principal', 'Bursar', 'Admissions Officer']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Guardian $guardian): bool
    {
        // 1. Admins have full access
        if ($user->hasRole(['Admin', 'ICT Admin', 'Principal', 'Deputy Principal', 'Bursar', 'Admissions Officer'])) {
            return true;
        }

        // 2. Class Teachers: Can view if the guardian belongs to a student in their ASSIGNED class
        if ($user->hasRole('Teacher') && $user->isClassTeacher()) {
             // Iterate through guardian's students to check class assignment
            foreach ($guardian->students as $student) {
                if ($user->isClassTeacherFor($student->class_id)) {
                    return true;
                }
            }
        }

        // 3. Subject Teachers: Can view if they teach the student (Limited view will be handled in Controller/Resource)
        if ($user->hasRole('Teacher')) {
             foreach ($guardian->students as $student) {
                if ($user->teachesClass($student->class_id)) { 
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage_guardians');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Guardian $guardian): bool
    {
        return $user->hasPermissionTo('manage_guardians');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Guardian $guardian): bool
    {
        return $user->hasPermissionTo('manage_guardians');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Guardian $guardian): bool
    {
        return $user->hasPermissionTo('manage_guardians');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Guardian $guardian): bool
    {
        return $user->hasPermissionTo('manage_guardians');
    }
}
