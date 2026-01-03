<?php

use App\Models\User;
use App\Models\Student;
use App\Models\SchoolClass;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Starting Stream Update Debug...\n";

// 1. Setup Data
// Create a Class "Form 1" "North" (Current)
$classNorth = SchoolClass::firstOrCreate(['name' => 'Form 1', 'stream' => 'North']);
// Create a Class "Form 1" "West" (Target) - Ensure it exists so we can test if it works when valid
$classWest = SchoolClass::firstOrCreate(['name' => 'Form 1', 'stream' => 'West']);

$admNo = 'DEBUG/' . time();
$user = User::create([
    'name' => 'Stream Tester',
    'email' => 'stream_test_' . time() . '@example.com',
    'password' => Hash::make('password'),
]);
$user->assignRole('Student');

$student = Student::create([
    'user_id' => $user->id,
    'admission_number' => $admNo,
    'class_id' => $classNorth->id, // Starts in North
    'gender' => 'Male',
]);

echo "Created Student in Class: " . $classNorth->name . " " . $classNorth->stream . "\n";

// 2. Test 1: Update to EXISTING Class (West)
$csvContent1 = "Admission No,Name,Email,Phone,Gender,Class,Stream,Parent Email\n";
$csvContent1 .= "$admNo,Stream Tester,{$user->email},,Male,Form 1,West,\n";

$path1 = storage_path('app/debug_stream_1.csv');
file_put_contents($path1, $csvContent1);

$controller = new \App\Http\Controllers\API\StudentController();

try {
    echo "Test 1: Updating to Existing Stream 'West'...\n";
    $req1 = new Request();
    $file1 = new UploadedFile($path1, 'debug_stream_1.csv', 'text/csv', null, true);
    $req1->files->set('file', $file1);
    
    $res1 = $controller->import($req1);
    $data1 = $res1->getData(true);
    
    $student->refresh();
    if ($student->class_id == $classWest->id) {
        echo "SUCCESS: Student moved to class ID {$classWest->id} (West)\n";
    } else {
        echo "FAILURE: Student still in class ID {$student->class_id} (Expected {$classWest->id})\n";
        print_r($data1);
    }

    // 3. Test 2: Update to NON-EXISTENT Class (South)
    echo "Test 2: Updating to Non-Existent Stream 'South'...\n";
    $csvContent2 = "Admission No,Name,Email,Phone,Gender,Class,Stream,Parent Email\n";
    $csvContent2 .= "$admNo,Stream Tester,{$user->email},,Male,Form 1,South,\n";
    
    $path2 = storage_path('app/debug_stream_2.csv');
    file_put_contents($path2, $csvContent2);
    
    $req2 = new Request();
    $file2 = new UploadedFile($path2, 'debug_stream_2.csv', 'text/csv', null, true);
    $req2->files->set('file', $file2);
    
    $res2 = $controller->import($req2);
    $data2 = $res2->getData(true);
    
    $student->refresh();
    if ($student->class_id == $classWest->id) {
        echo "SUCCESS: Student stayed in West (South does not exist)\n";
    } else {
        echo "FAILURE: Student changed class unexpectedly? ID: {$student->class_id}\n";
        echo "Initial Errors: " . print_r($data1['errors'] ?? [], true) . "\n";
        echo "Current Errors: " . print_r($data2['errors'] ?? [], true) . "\n";
    }

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

// Cleanup
$student->delete();
$user->delete();
// Don't delete classes as they might be used by others, or delete if just created? 
// For safety, leave classes.
unlink($path1);
unlink($path2);
