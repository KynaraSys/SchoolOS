<?php

use Illuminate\Contracts\Console\Kernel;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$app->make(Kernel::class)->bootstrap();

echo "Starting user creation...\n";

try {
    $user = \App\Models\User::firstOrCreate(
        ['email' => 'subject_teacher@school-os.com'],
        [
            'name' => 'Sarah Science',
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
            'email_verified_at' => now(),
        ]
    );

    if ($user->wasRecentlyCreated) {
        echo "User created successfully.\n";
    } else {
        echo "User already exists. ID: " . $user->id . "\n";
        // Update password just in case
        $user->password = \Illuminate\Support\Facades\Hash::make('password123');
        $user->save();
        echo "Password reset to 'password123'.\n";
    }

    try {
        $user->assignRole('Teacher');
        echo "Role 'Teacher' assigned.\n";
    } catch (\Exception $e) {
        echo "Role assignment failed: " . $e->getMessage() . "\n";
    }

    echo "Done.\n";

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
