<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetentionJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'target',
        'action',
        'rules',
        'schedule',
        'is_dry_run',
        'status',
        'last_run_at',
        'last_run_status',
    ];

    protected $casts = [
        'rules' => 'array',
        'is_dry_run' => 'boolean',
        'last_run_at' => 'datetime',
    ];

    public function logs()
    {
        return $this->hasMany(RetentionExecutionLog::class);
    }
}
