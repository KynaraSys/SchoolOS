<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IncidentStatusLog extends Model
{
    protected $fillable = [
        'incident_id',
        'old_status',
        'new_status',
        'changed_by',
        'comment',
    ];

    public function incident()
    {
        return $this->belongsTo(Incident::class);
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
