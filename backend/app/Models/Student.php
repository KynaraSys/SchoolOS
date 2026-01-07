<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Student extends Model
{
    use LogsActivity, \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'other_names',
        'admission_number',
        'uuid',
        'upi',
        'birth_certificate_number',
        'parent_email',
        'class_id',
        'phase_id',
        'entry_level',
        'pathway',
        'admission_date',
        'admission_status',
        'enrollment_status',
        'previous_school',
        'gender',
        'dob',
        'address',
        'email',
        'special_needs',
        'medical_notes',
        'accommodation_notes',
        'archived_at',
        'anonymized_at',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'name',
        'retention_status',
    ];

    protected $dates = [
        'archived_at',
        'anonymized_at',
    ];

    /**
     * Fields that can NEVER be changed after initial set.
     */
    const IMMUTABLE_FIELDS = [
        'admission_number',
        'uuid',
        'first_enrollment_cohort',
        'curriculum_framework',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logAll()
        ->logExcept([
            'updated_at', 'created_at', 'deleted_at', 'id'
        ])
        ->logOnlyDirty()
        ->dontSubmitEmptyLogs()
        ->setDescriptionForEvent(fn(string $eventName) => "{$eventName} student {$this->first_name} {$this->last_name}");
    }

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'parent_email' => 'encrypted',
        'address' => 'encrypted',
        'dob' => 'encrypted',
        'archived_at' => 'datetime',
        'anonymized_at' => 'datetime',
        'deleted_at' => 'datetime',
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
        // Pivot links Student <-> Guardian directly now.
        return $this->belongsToMany(Guardian::class, 'guardian_student', 'student_id', 'guardian_id')
                    ->withPivot('relationship_type', 'is_primary', 'receives_sms', 'receives_email', 'receives_whatsapp', 'receives_portal', 'receives_calls')
                    ->withTimestamps();
    }

    /**
     * Get the single guardian for this student (convenience).
     */
    public function getGuardianAttribute()
    {
        return $this->guardians()->first();
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

    /**
     * Get the learner profile associated with the student.
     */
    public function profile()
    {
        return $this->hasOne(LearnerProfile::class);
    }

    /**
     * Get the student's full name.
     */
    public function getNameAttribute()
    {
        if ($this->anonymized_at) {
            return "Anonymized Student " . substr(md5($this->id), 0, 8);
        }
        return trim("{$this->first_name} {$this->last_name} {$this->other_names}");
    }

    public function getRetentionStatusAttribute(): string
    {
        if ($this->anonymized_at) return 'anonymized';
        if ($this->archived_at) return 'archived';
        if ($this->trashed()) return 'deleted';
        return 'active';
    }

    /**
     * Scope a query to only include active students.
     */
    public function scopeActive($query)
    {
        return $query->whereNull('archived_at')->whereNull('anonymized_at');
    }

    /**
     * Scope a query to only include archived students.
     */
    public function scopeArchived($query)
    {
        return $query->whereNotNull('archived_at')->whereNull('anonymized_at');
    }

    /**
     * Archive the student.
     */
    public function archive()
    {
        $this->update(['archived_at' => now(), 'enrollment_status' => 'archived']);
    }

    /**
     * Anonymize the student.
     */
    public function anonymize()
    {
        // Implement anonymization logic here, potentially hashing sensitive fields
        // For now, just mark as anonymized
        $this->update(['anonymized_at' => now(), 'enrollment_status' => 'anonymized']);
    }

    /**
     * Restore the student from archive/anonymization (if allowed).
     */
    public function restoreFromArchive()
    {
        $this->update(['archived_at' => null, 'anonymized_at' => null, 'enrollment_status' => 'active']);
    }
}
