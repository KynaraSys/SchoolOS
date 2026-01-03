<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class ForceDeleteTrashedUsers extends Command
{
    protected $signature = 'users:purge-trashed';
    protected $description = 'Permanently remove soft-deleted users from the database.';

    public function handle()
    {
        $count = User::onlyTrashed()->count();

        if ($count === 0) {
            $this->info('No soft-deleted users found.');
            return;
        }

        $this->warn("Found {$count} soft-deleted users.");
        if ($this->confirm("Do you want to PERMANENTLY delete these {$count} users? This cannot be undone.", true)) {
            User::onlyTrashed()->forceDelete();
            $this->info("Permanently deleted {$count} users.");
        }
    }
}
