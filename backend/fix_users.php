<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

echo "Fixing user active statuses...\n";

// Find users where is_active is NULL or 0 (if we assume default should be active)
// Actually better to just set all NULLs to 1 (true).
// If it was 0 (inactive), we keep it inactive.
// But earlier checks showed it was NULL.

User::whereNull('is_active')->update(['is_active' => true]);

echo "Updated users with NULL status to Active.\n";

$users = User::all();
foreach($users as $user) {
    echo "User {$user->id}: {$user->name} - Is Active: " . ($user->is_active ? 'Yes' : 'No') . "\n";
}
