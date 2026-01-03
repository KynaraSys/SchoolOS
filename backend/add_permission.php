<?php

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Adding manage_guardians permission...\n";

// 1. Create Permission
try {
    $perm = Permission::firstOrCreate(['name' => 'manage_guardians', 'guard_name' => 'web']);
    echo "Permission 'manage_guardians' created/found.\n";
} catch (\Exception $e) {
    // Sometimes guard mismatch
     $perm = Permission::where('name', 'manage_guardians')->first();
     if (!$perm) {
         $perm = Permission::create(['name' => 'manage_guardians', 'guard_name' => 'web']);
     }
}

// 2. Assign to Roles
$roles = ['Super Admin', 'ICT Admin', 'Principal'];

foreach ($roles as $roleName) {
    try {
        $role = Role::findByName($roleName);
        if ($role) {
            $role->givePermissionTo('manage_guardians');
            echo "Assigned to $roleName.\n";
        } else {
            echo "Role $roleName not found.\n";
        }
    } catch (\Exception $e) {
        echo "Error assigning to $roleName: " . $e->getMessage() . "\n";
    }
}

// 3. Update 'Admin' if it exists (some setups use Admin as Super Admin alias)
try {
    $adminRole = Role::where('name', 'Admin')->first();
    if ($adminRole) {
        $adminRole->givePermissionTo('manage_guardians');
        echo "Assigned to Admin.\n";
    }
} catch (\Exception $e) {}

echo "Done.\n";
