<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetentionExecutionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'retention_job_id',
        'action',
        'records_affected',
        'is_dry_run',
        'initiated_by',
        'status',
        'details',
    ];

    protected $casts = [
        'is_dry_run' => 'boolean',
    ];

    public function job()
    {
        return $this->belongsTo(RetentionJob::class, 'retention_job_id');
    }
}
