<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

$students = \App\Models\Student::with('user', 'schoolClass')->latest()->take(5)->get();

foreach ($students as $student) {
    echo "Adm: {$student->admission_number} | ClassID: {$student->class_id} | ClassName: " . ($student->schoolClass ? $student->schoolClass->name : 'NULL') . "\n";
}
