<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = \App\Models\User::with('roles')->get()->map(function($u) {
    return [
        'id' => $u->id,
        'name' => $u->name,
        'email' => $u->email,
        'roles' => $u->getRoleNames()
    ];
});
echo $users->toJson(JSON_PRETTY_PRINT);
