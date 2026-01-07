<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'subject_id',
        'competency_id',
        'assessment_type', // pure_cbe, hybrid
        'tool_type', // observation, project, written_test, checklist
        'raw_score',
        'derived_indicator', // EE1, ME2
        'performance_level', // EE, ME, AE, BE (or specific level)
        'teacher_remarks',
        'evidence_paths', // JSON
        'assessed_at',
        'assessor_id'
    ];

    protected $casts = [
        'evidence_paths' => 'array',
        'assessed_at' => 'datetime',
        'raw_score' => 'decimal:2',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function assessor()
    {
        return $this->belongsTo(User::class, 'assessor_id');
    }
}
