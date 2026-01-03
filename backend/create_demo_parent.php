<?php

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Guardian;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

// 1. Create User
$user = User::firstOrCreate(
    ['email' => 'demo.parent@school-os.com'],
    [
        'name' => 'Demo Parent',
        'password' => Hash::make('password123'),
        'phone' => '254700000000',
        'is_active' => true,
        'email_verified_at' => now(),
    ]
);

// 2. Assign Role
if (!Role::where('name', 'Parent')->exists()) {
    Role::create(['name' => 'Parent']);
}
$user->assignRole('Parent');

// 3. Create Guardian Profile
$guardian = Guardian::firstOrCreate(
    ['email' => $user->email],
    [
        'user_id' => $user->id,
        'first_name' => 'Demo',
        'last_name' => 'Parent',
        'phone_number' => '254700000000',
        'relationship_type' => 'Father',
    ]
);

// 4. Link to a Student
$studentUser = User::role('Student')->first();

if ($studentUser) {
    if (!$guardian->students()->where('student_id', $studentUser->id)->exists()) {
        $guardian->students()->attach($studentUser->id, ['is_primary' => true]);
        echo "Linked to student: " . $studentUser->name . "\n";
    } else {
        echo "Already linked to student: " . $studentUser->name . "\n";
    }
} else {
    echo "No student found to link.\n";
}

echo "Demo Parent Created:\n";
echo "Email: " . $user->email . "\n";
echo "Password: password123\n";
