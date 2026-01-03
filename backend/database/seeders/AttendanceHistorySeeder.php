<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AttendanceHistorySeeder extends Seeder
{
    public function run(): void
    {
        $students = Student::whereHas('schoolClass')->get();
        $marker = User::role('Teacher')->first() ?? User::first(); // Use a teacher or fallback to any user
        
        // Seed for the last 30 days
        $startDate = Carbon::today()->subDays(60);
        $endDate = Carbon::today();
        
        $this->command->info("Seeding attendance for {$students->count()} students from {$startDate->toDateString()} to {$endDate->toDateString()}...");

        foreach ($students as $student) {
            $currentDate = $startDate->copy();
            
            while ($currentDate <= $endDate) {
                // Skip weekends
                if ($currentDate->isWeekend()) {
                    $currentDate->addDay();
                    continue;
                }

                // Determine status probabilistically
                $rand = rand(1, 100);
                if ($rand <= 80) {
                    $status = 'present';
                } elseif ($rand <= 90) {
                    $status = 'late';
                } elseif ($rand <= 95) {
                    $status = 'absent';
                } else {
                    $status = 'excused';
                }

                // Create attendance record
                Attendance::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'date' => $currentDate->toDateString(),
                    ],
                    [
                        'class_id' => $student->class_id,
                        'status' => $status,
                        'marked_by' => $marker->id,
                        'marked_at' => $currentDate->copy()->setTime(8, 0, 0),
                        'remarks' => $status === 'absent' ? 'Auto-seeded absence' : null,
                    ]
                );

                $currentDate->addDay();
            }
        }
        
        $this->command->info('Attendance history seeded successfully.');
    }
}
