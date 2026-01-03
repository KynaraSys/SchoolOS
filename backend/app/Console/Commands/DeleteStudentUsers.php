<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DeleteStudentUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-student-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete all users that have a student profile';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Finding student users...');

        // Find users that have a 'student' relationship
        $users = User::has('student')->get();
        $count = $users->count();

        if ($count === 0) {
            $this->info('No student users found.');
            return;
        }

        $this->warn("Found {$count} student users.");
        if (!$this->confirm('Are you sure you want to FORCE DELETE these users? This action cannot be undone.')) {
            $this->info('Operation cancelled.');
            return;
        }

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        DB::beginTransaction();
        try {
            foreach ($users as $user) {
                // Force delete to remove entirely from database (including soft deletes if enabled, though User model uses SoftDeletes, we want them gone-gone as per "delete all" request implies cleanup)
                // However, standard delete might be safer if we want to keep history? 
                // User asked "delete all", usually implies total removal or at least soft delete. 
                // The plan said "forceDelete". adhering to plan.
                $user->forceDelete();
                $bar->advance();
            }
            DB::commit();
            $bar->finish();
            $this->newLine();
            $this->info('Successfully deleted all student users.');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->newLine();
            $this->error('An error occurred: ' . $e->getMessage());
        }
    }
}
