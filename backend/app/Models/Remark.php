<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Remark extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'author_id',
        'term_id',
        'type', // formative, profile, report
        'author_role', // subject_teacher, class_teacher, head_teacher
        'title',
        'remark_text',
        'status',
    ];

    /**
     * Get the student that the remark belongs to.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the author of the remark.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the term associated with the remark.
     */
    public function term()
    {
        return $this->belongsTo(Term::class);
    }
}
