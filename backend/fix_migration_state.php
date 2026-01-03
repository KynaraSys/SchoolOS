<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Removing mismatched migration entry...\n";

$deleted = DB::table('migrations')
    ->where('migration', '2025_12_23_052432_add_is_active_to_users_table')
    ->delete();

if ($deleted) {
    echo "Successfully removed migration entry. You can now run 'php artisan migrate'.\n";
} else {
    echo "Migration entry not found or already removed.\n";
}
