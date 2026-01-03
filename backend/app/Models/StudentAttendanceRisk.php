<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAttendanceRisk extends Model
{
    use HasFactory;

    protected $table = 'student_attendance_risks';

    protected $fillable = [
        'student_id',
        'term_id',
        'risk_score',
        'risk_level',
        'last_evaluated_at',
        'primary_factors',
    ];

    protected $casts = [
        'primary_factors' => 'array',
        'last_evaluated_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function term()
    {
        return $this->belongsTo(Term::class);
    }
}
