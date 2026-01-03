<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
    ];

    public function teacherSubjects()
    {
        return $this->hasMany(TeacherSubject::class);
    }
    
    public function grades()
    {
        return $this->hasMany(Grade::class);
    }
}
