<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::first();
echo "User ID: " . $user->id . "\n";
echo "Is Active: " . ($user->is_active === null ? 'NULL' : ($user->is_active ? 'TRUE' : 'FALSE')) . "\n";
echo "Is Active Raw: " . $user->getAttribute('is_active') . "\n";
