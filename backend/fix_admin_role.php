<?php
use App\Models\User;
use Spatie\Permission\Models\Role;

// Ensure Admin role exists
if (!Role::where('name', 'Admin')->exists()) {
    Role::create(['name' => 'Admin']);
}

$user = User::find(1);
if ($user) {
    $user->assignRole('Admin');
    echo "Assigned Admin role to User 1 ({$user->name})\n";
} else {
    echo "User 1 not found\n";
}
