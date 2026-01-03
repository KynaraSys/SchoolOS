<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$roles = \Spatie\Permission\Models\Role::all();
echo "Roles Found: " . $roles->count() . "\n";
foreach ($roles as $role) {
    echo "- Name: {$role->name} | Guard: {$role->guard_name}\n";
}
