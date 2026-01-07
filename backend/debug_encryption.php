<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Student;
use Illuminate\Contracts\Encryption\DecryptException;

echo "--- Debugging Student Encryption ---\n";

$students = Student::all();
echo "Found " . $students->count() . " students in DB.\n";

foreach ($students as $student) {
    echo "Checking Student ID: " . $student->id . "... ";
    try {
        // Accessing these triggers decryption
        $email = $student->parent_email; 
        $dob = $student->dob;
        $address = $student->address;
        echo "OK (Decrypted: $dob)\n";
    } catch (DecryptException $e) {
        echo "FAIL! DecryptException: " . $e->getMessage() . "\n";
        echo "This record likely has plaintext data.\n";
    } catch (\Exception $e) {
        echo "FAIL! " . get_class($e) . ": " . $e->getMessage() . "\n";
    }
}
