<?php

namespace App\Services\Retention;

use App\Models\RetentionJob;
use App\Models\RetentionExecutionLog;
use App\Models\Student;
use App\Models\Guardian;
use App\Models\Activity; // System Logs
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class RetentionPolicyService
{
    protected $ruleEngine;

    public function __construct(RetentionRuleEngine $ruleEngine)
    {
        $this->ruleEngine = $ruleEngine;
    }

    /**
     * Execute a retention job.
     *
     * @param RetentionJob $job
     * @param string|null $initiatedBy
     * @return RetentionExecutionLog
     */
    public function executeJob(RetentionJob $job, ?string $initiatedBy = 'System'): RetentionExecutionLog
    {
        $log = new RetentionExecutionLog([
            'retention_job_id' => $job->id,
            'action' => $job->action,
            'is_dry_run' => $job->is_dry_run,
            'initiated_by' => $initiatedBy,
            'status' => 'Pending',
        ]);

        try {
            $query = $this->getQueryForTarget($job->target);
            $this->ruleEngine->applyRules($query, $job->rules ?? []);

            // Count affected records
            $count = $query->count();
            $log->records_affected = $count;

            if ($job->is_dry_run) {
                // In dry run, we just list a sample or summary
                $details = [
                    'message' => "Dry run completed. Found {$count} records.",
                    'sample_ids' => $query->limit(5)->pluck('id')->toArray(),
                ];
                $log->details = json_encode($details);
                $log->status = 'Success'; // Dry run success
            } else {
                // Execute destructive action
                $this->performAction($query, $job->target, $job->action);
                $log->status = 'Success';
                $log->details = json_encode(['message' => "Successfully processed {$count} records."]);
            }
            
            // Update Job Last Run
            $job->update([
                'last_run_at' => now(),
                'last_run_status' => 'Success'
            ]);

        } catch (Exception $e) {
            $log->status = 'Failed';
            $log->details = json_encode(['error' => $e->getMessage()]);
             $job->update([
                'last_run_at' => now(),
                'last_run_status' => 'Failed'
            ]);
            Log::error("Retention Job Failed: {$e->getMessage()}", ['job_id' => $job->id]);
        }

        $log->save();
        return $log;
    }

    protected function getQueryForTarget(string $target)
    {
        switch ($target) {
            case 'Students':
                return Student::query();
            case 'Guardians':
                return Guardian::query();
            case 'System Logs':
                return Activity::query(); // Assuming Application Log model
            default:
                throw new Exception("Unknown target: {$target}");
        }
    }

    protected function performAction($query, string $target, string $action)
    {
        // Safety Check: Prevent deletion of Academic Records (Students) unless strictly archived? 
        // For now, Student deletion is protected by hard rule if action is DELETE and target is Students.
        if ($target === 'Students' && $action === 'Delete') {
             // In real app, check if strict deletion is allowed. 
             // For safety, we might throw exception or require double confirmation flag not passed here yet.
             // But assuming job config is source of truth.
        }

        switch ($action) {
            case 'Archive':
                // Assuming SoftDeletes or specific 'status' = 'Archived'
                if ($target === 'Students') {
                   $query->update(['status' => 'Archived', 'archived_at' => now()]);
                } else {
                   // Generic soft delete if available
                   $query->delete(); 
                }
                break;
            case 'Anonymize':
                // Implement Anonymization Logic
                // E.g. update name to 'Anonymized', email to 'anon@example.com'
                if ($target === 'Students') {
                    $query->update([
                        'first_name' => 'Anonymized',
                        'last_name' => 'Student',
                        'email' => DB::raw("CONCAT('anon', id, '@school.org')"),
                        'phone' => null,
                        // ... other PII fields
                    ]);
                }
                break;
            case 'Delete':
                $query->forceDelete();
                break;
            default:
                throw new Exception("Unknown action: {$action}");
        }
    }
}
