<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subject', // Keep string column as per constraint
        'score',
        'subject_id',
        'class_id',
        'term_id',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    // New Relationships
    public function subjectModel()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function term()
    {
        return $this->belongsTo(Term::class);
    }
}
