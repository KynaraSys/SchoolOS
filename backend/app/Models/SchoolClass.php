<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'name',
        'grade_level',
        'stream',
        'curriculum',
    ];

    public function teacherSubjects()
    {
        return $this->hasMany(TeacherSubject::class, 'class_id');
    }

    public function classTeacherAssignments()
    {
        return $this->hasMany(ClassTeacherAssignment::class, 'class_id');
    }

    public function currentTeacher()
    {
        return $this->hasOne(ClassTeacherAssignment::class, 'class_id')
            ->where('is_primary', true)
            ->where('academic_year', date('Y')); // Default to current year, dynamic handling in controller prefers
    }

    public function grades()
    {
        return $this->hasMany(Grade::class, 'class_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'class_id');
    }
}
