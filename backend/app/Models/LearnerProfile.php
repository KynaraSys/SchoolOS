<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearnerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'strengths',
        'areas_for_support',
        'social_emotional_notes',
        'talents_interests',
        'teacher_general_remarks',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
