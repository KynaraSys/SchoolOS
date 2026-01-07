<?php

namespace App\Http\Controllers;

use App\Models\RetentionJob;
use App\Models\RetentionExecutionLog;
use App\Services\Retention\RetentionPolicyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RetentionController extends Controller
{
    protected $service;

    public function __construct(RetentionPolicyService $service)
    {
        $this->service = $service;
    }

    public function indexJobs()
    {
        return response()->json(RetentionJob::all());
    }

    public function storeJob(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'target' => 'required|string',
            'action' => 'required|string',
            'rules' => 'required|array',
            'schedule' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job = RetentionJob::create($request->all());
        return response()->json($job, 201);
    }

    public function updateJob(Request $request, RetentionJob $job)
    {
        $job->update($request->all());
        return response()->json($job);
    }

    public function destroyJob(RetentionJob $job)
    {
        $job->delete();
        return response()->json(['message' => 'Job deleted']);
    }

    public function runJob(Request $request, RetentionJob $job)
    {
        $dryRun = $request->input('dry_run', true);
        
        // Temporarily override dry_run for this execution if requested, 
        // but we might want to respect the job's default setting or the flag.
        // The service takes the job's properties.
        // Let's create a temporary clone or modify the job instance in memory? 
        // Or better, update the service to accept override.
        // For now, let's update the job's dry_run status if we want to save that state, 
        // OR we just assume the UI toggles the job's setting before running.
        // Let's assume we force it for this run.
        
        $job->is_dry_run = $dryRun; 
        
        $log = $this->service->executeJob($job, auth()->user()->name ?? 'Admin');
        
        return response()->json($log);
    }

    public function indexLogs()
    {
        return response()->json(RetentionExecutionLog::with('job')->latest()->limit(50)->get());
    }

    public function stats()
    {
        // Mock stats for now or calculate real ones
        return response()->json([
            'students_archived' => RetentionExecutionLog::where('action', 'Archive')->sum('records_affected'),
            'storage_freed' => '1.2 GB', // Placeholder
        ]);
    }
}
