<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'other_names',
        'admission_number',
        'parent_email',
        'class_id',
        'gender',
        'dob',
        'address',
    ];

    /**
     * Get the user that owns the student profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The guardians that belong to the student.
     */
    public function guardians()
    {
        return $this->belongsToMany(Guardian::class, 'guardian_student', 'student_id', 'guardian_id')
                    ->withPivot('is_primary', 'receives_sms', 'receives_email', 'receives_whatsapp', 'receives_portal', 'receives_calls')
                    ->withTimestamps();
    }

    /**
     * Get the class the student belongs to.
     */
    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    /**
     * Get the payments for the student.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function attendanceRisks()
    {
        return $this->hasMany(StudentAttendanceRisk::class);
    }

    public function currentRisk()
    {
        return $this->hasOne(StudentAttendanceRisk::class)->latest('last_evaluated_at');
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }
}
