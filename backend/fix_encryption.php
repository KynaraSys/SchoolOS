<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

echo "--- Fixing Encryption for Existing Data ---\n";

function fixTable($tableName, $fields) {
    echo "Processing table: $tableName\n";
    $rows = DB::table($tableName)->get();
    $count = 0;

    foreach ($rows as $row) {
        $updates = [];
        foreach ($fields as $field) {
            $value = $row->{$field};
            
            if (empty($value)) continue;

            // Check if already encrypted
            try {
                Crypt::decryptString($value);
                // If successful, it's already encrypted. Skip.
            } catch (DecryptException $e) {
                // Not encrypted (or corrupted, but we assume plaintext)
                // Encrypt it
                $encrypted = Crypt::encryptString($value);
                $updates[$field] = $encrypted;
            } catch (\Exception $e) {
                echo "Error checking $field for ID {$row->id}: " . $e->getMessage() . "\n";
            }
        }

        if (!empty($updates)) {
            DB::table($tableName)->where('id', $row->id)->update($updates);
            $count++;
            echo "Fixed ID {$row->id}\n";
        }
    }
    echo "Updated $count records in $tableName.\n";
}

// Fix Students
fixTable('students', ['parent_email', 'address', 'dob']);

// Fix Guardians
fixTable('guardians', ['email', 'phone_number', 'national_id', 'address']);

echo "Done.\n";
