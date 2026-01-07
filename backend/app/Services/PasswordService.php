<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Notifications\TemporaryPasswordNotification;

class PasswordService
{
    /**
     * Create a secure random password and prepare user creation attributes.
     * Returns an array with 'hash' and 'plain'.
     *
     * @return array
     */
    public static function generateSecurePassword(): array
    {
        $plain = Str::random(12);
        return [
            'plain' => $plain,
            'hash' => Hash::make($plain),
        ];
    }

    /**
     * Sets a temporary password for a user, forces password change, and sends notification.
     *
     * @param User $user
     * @return void
     */
    public static function setTemporaryPassword(User $user)
    {
        $passwordData = self::generateSecurePassword();

        $user->password = $passwordData['hash'];
        $user->force_password_change = true;
        $user->save();

        $user->notify(new TemporaryPasswordNotification($passwordData['plain']));
    }

    /**
     * Helper to get initial password attributes for User creation.
     * NOTE: This does NOT send the notification. You must call sendNotification explicitly after User is created.
     */
    public static function generateInitialPasswordAttributes(): array
    {
        $passwordData = self::generateSecurePassword();
        return [
            'password' => $passwordData['hash'],
            'force_password_change' => true,
            'plain_password' => $passwordData['plain'] // Pass this back to caller to send notification
        ];
    }
}
