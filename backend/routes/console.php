<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use Illuminate\Support\Facades\Schedule;
use App\Models\RetentionJob;
use App\Services\Retention\RetentionPolicyService;

Schedule::call(function (RetentionPolicyService $service) {
    // Run active jobs daily at 2 AM
    $jobs = RetentionJob::where('status', 'Active')->get();
    foreach ($jobs as $job) {
        $service->executeJob($job, 'System (Scheduled)');
    }
})->dailyAt('02:00');

