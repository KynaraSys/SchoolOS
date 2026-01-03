<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Student;
use App\Models\SchoolClass;
use App\Services\AttendanceRiskService;

class CalculateAttendanceRisk extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:calculate-risk {--class_id= : Optional Class ID filter}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate attendance risk scores for students based on recent data';

    /**
     * Execute the console command.
     */
    public function handle(AttendanceRiskService $service)
    {
        $classId = $this->option('class_id');

        $query = Student::query();

        if ($classId) {
            $query->where('class_id', $classId);
        }
        
        // Eager load only critical things if needed
        $students = $query->get();
        
        $this->info("Found {$students->count()} students to evaluate.");
        
        $bar = $this->output->createProgressBar($students->count());
        $bar->start();

        foreach ($students as $student) {
            try {
                $service->calculateRisk($student);
            } catch (\Exception $e) {
                // Log error but continue
                $this->error("Error for student {$student->id}: " . $e->getMessage());
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Attendance risk calculation completed.');
    }
}
