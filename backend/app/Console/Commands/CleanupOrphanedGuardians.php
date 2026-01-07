<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CleanupOrphanedGuardians extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'guardians:cleanup-orphaned';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove guardians who are not linked to any student';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for orphaned guardians...');

        $guardians = \App\Models\Guardian::doesntHave('students')->get();
        $count = $guardians->count();

        if ($count === 0) {
            $this->info('No orphaned guardians found.');
            return;
        }

        $this->info("Found {$count} orphaned guardians. Deleting...");

        foreach ($guardians as $guardian) {
            $this->line("Deleting guardian ID: {$guardian->id} - {$guardian->first_name} {$guardian->last_name}");
            
            // Optional: Delete associated User if it exists and is not used elsewhere? 
            // For now, we only delete the Guardian record as requested.
            // Notes and Documents will optionally cascade delete based on migration, but model deletion handles events.
            
            $guardian->delete();
        }

        $this->info('Cleanup completed.');
    }
}
