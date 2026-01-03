<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    public function run(): void
    {
        $students = Student::with('user')->get(); // Grade links to user_id in model, check this relationship
        // Actually Grade model says `user_id` but relationship `student()` links to User class.
        // Usually Grade should link to Student model or User model consistently.
        // Assuming user_id refers to the student's User ID.

        foreach ($students as $student) {
            if (!$student->user) continue;

            // Generate grades for 5 subjects
            $subjects = ['Math', 'English', 'Kiswahili', 'Science', 'Social Studies'];
            
            foreach ($subjects as $subject) {
                Grade::create([
                    'user_id' => $student->user->id, 
                    'subject' => $subject,
                    'score' => rand(40, 100), // Random score
                    'class_id' => $student->class_id,
                    // 'term_id' => 1, // Optional if seeded
                ]);
            }
        }
    }
}
