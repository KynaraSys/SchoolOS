<?php

use App\Models\Student;
use App\Models\Guardian;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Spatie\Activitylog\Models\Activity;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// 1. Encrpytion Test
echo "--- Testing Encryption ---\n";

// Create User first due to foreign key
$user = User::factory()->create();

// Create Guardian with sensitive data
$guardian = Guardian::create([
    'first_name' => 'Security',
    'last_name' => 'Test',
    'phone_number' => '0700000000', // Should be encrypted
    'email' => 'secure@test.com', // Should be encrypted
    'national_id' => '12345678', // Should be encrypted
    'address' => 'Secret Location', // Should be encrypted
    'user_id' => $user->id,
]);

// Fetch raw from DB to verify encryption
$rawGuardian = \DB::table('guardians')->where('id', $guardian->id)->first();
echo "Raw Phone in DB: " . $rawGuardian->phone_number . "\n";
if ($rawGuardian->phone_number !== '0700000000') {
    echo "✅ Phone number is encrypted in DB.\n";
} else {
    echo "❌ Phone number is PLAINTEXT in DB.\n";
}

// Fetch via Eloquent to verify decryption
$loadedGuardian = Guardian::find($guardian->id);
echo "Decrypted Phone: " . $loadedGuardian->phone_number . "\n";
if ($loadedGuardian->phone_number === '0700000000') {
    echo "✅ Phone number decrypted correctly.\n";
} else {
    echo "❌ Phone number decryption FAILED.\n";
}

// 2. Audit Log Test
echo "\n--- Testing Audit Logs ---\n";
// Update the user to trigger log
$user->update(['name' => 'Updated Name for Log']);

$lastActivity = Activity::latest()->first();

if ($lastActivity && $lastActivity->subject_id == $user->id) {
    echo "✅ Activity Logged: " . $lastActivity->description . " on " . $lastActivity->subject_type . "\n";
    echo "Changes: " . json_encode($lastActivity->properties) . "\n";
} else {
    echo "❌ No Activity found for User update.\n";
}

// Cleanup
$guardian->delete();
$user->delete();
