<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Guardian;
use App\Models\Student;

class CommunicationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'guardian_id',
        'student_id',
        'type',
        'subject',
        'message',
        'sent_at',
        'status'
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    public function guardian()
    {
        return $this->belongsTo(Guardian::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
