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
        return $user->hasPermissionTo('manage_guardians') || $user->hasPermissionTo('view_users');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Guardian $guardian): bool
    {
        if ($user->hasPermissionTo('manage_guardians')) {
            return true;
        }

        // Parent can view provided it's their own record? Or usually they view their kids.
        // A Guardian user usually has a User account, but the 'Guardian' model is a separate entity linked to students.
        // If the logged in user IS the guardian, we need to check linkage.
        // For now, let's allow 'view_users' or 'manage_guardians'.
         return $user->hasPermissionTo('manage_guardians') || $user->hasPermissionTo('view_users');
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
