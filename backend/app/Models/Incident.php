<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    // Status Constants
    const STATUS_PENDING = 'pending';
    const STATUS_UNDER_REVIEW = 'under_review';
    const STATUS_ESCALATED = 'escalated';
    const STATUS_RESOLVED = 'resolved';
    const STATUS_DISMISSED = 'dismissed';

    protected $fillable = [
        'student_id',
        'reporter_id',
        'title',
        'description',
        'action_taken',
        'severity',
        'status',
        'occurred_at',
        'assigned_to',
        'closed_by',
        'closed_at',
    ];

    protected $casts = [
        'occurred_at' => 'date',
        'closed_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function incidentType()
    {
        return $this->belongsTo(IncidentType::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function closedBy()
    {
        return $this->belongsTo(User::class, 'closed_by');
    }

    public function logs()
    {
        return $this->hasMany(IncidentStatusLog::class);
    }
}
