<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SeedMissingGuardians extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'guardians:seed-missing';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create and attach guardians for students who do not have one';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for students without guardians...');

        // Verify factory exists first (for safety in production environments)
        if (!class_exists(\Database\Factories\GuardianFactory::class)) {
            // Check if we can just use the model factory
            try {
                \App\Models\Guardian::factory();
            } catch (\Throwable $e) {
                $this->error('Guardian factory not found. Cannot proceed.');
                return;
            }
        }

        $students = \App\Models\Student::doesntHave('guardians')->get();
        $count = $students->count();

        if ($count === 0) {
            $this->info('All students already have at least one guardian.');
            return;
        }

        $this->info("Found {$count} students without guardians. Creating guardians...");

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        foreach ($students as $student) {
            try {
                // Create a new guardian using the factory
                $guardian = \App\Models\Guardian::factory()->create();

                // Attach to student
                // Note: The pivot table requires student_id (user_id of student) or student id depending on schema
                // Based on recent investigation, guardian_student.student_id references students.id
                
                // We use the relationship on student model to attach
                $student->guardians()->attach($guardian->id, [
                    'is_primary' => true,
                    'receives_sms' => true,
                    'receives_email' => true
                ]);

            } catch (\Exception $e) {
                $this->error("Failed to create guardian for student ID {$student->id}: " . $e->getMessage());
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Seeding completed.');
    }
}
