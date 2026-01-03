<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CleanupOrphanUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cleanup-orphans';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete users who have the Student role but are missing their Student profile record.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Scanning for orphan users...');

        // 1. Identify Orphaned Students
        // Users who have 'Student' role does NOT have a corresponding record in 'students' table.
        // using whereDoesntHave('student') requires the relationship to be defined (which it is).
        
        $orphanStudents = User::role('Student')
            ->doesntHave('student')
            ->get();

        $count = $orphanStudents->count();

        if ($count === 0) {
            $this->info('No orphaned student users found.');
            return;
        }

        $this->warn("Found {$count} users with 'Student' role but NO student profile.");
        
        if ($this->confirm("Do you want to delete these {$count} users?", true)) {
            $bar = $this->output->createProgressBar($count);
            $bar->start();

            foreach ($orphanStudents as $user) {
                // Safely delete
                // DB::transaction might be overkill for individual deletes unless we batch, 
                // but let's just delete the user.
                $user->delete();
                $bar->advance();
            }

            $bar->finish();
            $this->newLine();
            $this->info("Successfully deleted {$count} orphan users.");
        } else {
            $this->info('Operation cancelled.');
        }
    }
}
