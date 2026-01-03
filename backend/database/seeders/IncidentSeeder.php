<?php

namespace Database\Seeders;

use App\Models\Incident;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class IncidentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Get all students
        $students = Student::all();

        if ($students->isEmpty()) {
            $this->command->info('No students found. Skipping Incident seeding.');
            return;
        }

        // Get some users to acting as reporters (e.g. teachers or admins)
        // Ideally we pick users who are teachers, but for now any user is fine.
        $reporters = User::limit(5)->get();

        if ($reporters->isEmpty()) {
             $this->command->info('No users found. Skipping Incident seeding.');
             return;
        }

        // Common incident types
        $titles = [
            'Late to class',
            'Incomplete homework',
            'Uniform violation',
            'Disruptive behavior',
            'Unauthorized absence',
            'Bullying',
            'Noise making',
            'Fighting'
        ];

        $actions = [
            'Verbal warning',
            'Parent notification',
            'Warning issued',
            'Detention',
            'Suspension',
            'Guidance and Counseling'
        ];

        foreach ($students as $student) {
            // 30% chance a student has a discipline record
            if (rand(0, 100) < 30) {
                // Create 1-3 incidents for this student
                $count = rand(1, 3);
                
                for ($i = 0; $i < $count; $i++) {
                    Incident::create([
                        'student_id' => $student->id,
                        'reporter_id' => $reporters->random()->id,
                        'title' => $faker->randomElement($titles),
                        'description' => $faker->paragraph(),
                        'action_taken' => $faker->randomElement($actions),
                        'severity' => $faker->randomElement(['low', 'medium', 'high', 'critical']),
                        'status' => $faker->randomElement(['pending', 'resolved', 'dismissed', 'escalated']),
                        'occurred_at' => $faker->dateTimeBetween('-3 months', 'now'),
                    ]);
                }
            }
        }
    }
}
