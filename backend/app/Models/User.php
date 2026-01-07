<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'profile_image',
        'password',
        'force_password_change',
        'failed_login_attempts',
        'locked_until',
        'is_active',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'force_password_change' => 'boolean',
        'locked_until' => 'datetime',
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
    ];


    /**
     * Relationship: A user (teacher) can have multiple class teacher assignments.
     */
    public function classTeacherAssignments()
    {
        return $this->hasMany(ClassTeacherAssignment::class);
    }

    /**
     * Relationship: A user (teacher) teaches multiple subjects.
     */
    public function teacherSubjects()
    {
        return $this->hasMany(TeacherSubject::class);
    }

    /**
     * Check if the user is a class teacher (has any assignment).
     * @return bool
     */
    public function isClassTeacher(): bool
    {
        // Check if there is at least one record in class_teacher_assignments
        return $this->classTeacherAssignments()->exists();
    }

    /**
     * Check if the user is a class teacher for a specific class.
     * @param int $classId
     * @return bool
     */
    public function isClassTeacherFor($classId): bool
    {
        return $this->classTeacherAssignments()
                    ->where('class_id', $classId)
                    ->exists();
    }

    /**
     * Check if the user teaches ANY subject in the given class OR is the class teacher.
     */
    public function teachesClass($classId): bool
    {
        if ($this->isClassTeacherFor($classId)) {
            return true;
        }

        return $this->teacherSubjects()
                    ->where('class_id', $classId)
                    ->exists();
    }

    /**
     * Check if the user teaches a specific subject in a specific class.
     */
    public function teachesSubjectInClass($subjectId, $classId): bool
    {
        return $this->teacherSubjects()
                    ->where('class_id', $classId)
                    ->where('subject_id', $subjectId)
                    ->exists();
    }
    /**
     * Relationship: Get the student profile associated with the user.
     */
    public function student()
    {
        return $this->hasOne(Student::class);
    }

    /**
     * Relationship: Get the staff profile associated with the user.
     */
    public function staff()
    {
        return $this->hasOne(Staff::class);
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
     * Get the single guardian for this user (student).
     */
    public function getGuardianAttribute()
    {
        return $this->guardians()->first();
    }

    /**
     * Get the primary guardian.
     */

    public function scopePrimaryGuardian($query)
    {
        return $query->whereHas('guardians', function ($q) {
            $q->where('is_primary', true);
        });
    }

    /**
     * Scope a query to only include staff members.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeStaff($query)
    {
        return $query->whereHas('roles', function ($q) {
            $q->whereNotIn('name', ['Student', 'Parent']);
        });
    }

    public function reportedIncidents()
    {
        return $this->hasMany(Incident::class, 'reporter_id');
    }

    /**
     * User conversations.
     */
    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_participants')
            ->withPivot(['last_read_at', 'is_muted'])
            ->withTimestamps();
    }

    /**
     * Check if user can message another user.
     */
    public function canMessage(User $recipient): bool
    {
        // 1. Admin can message anyone, and anyone can message them.
        if ($this->hasRole('Admin') || $recipient->hasRole('Admin')) {
            return true;
        }

        // Define generic "Staff" roles (add more as needed)
        // Dynamic Staff Check: Any role that is NOT 'Student' or 'Parent'
        $isSenderStaff = $this->roles->contains(function ($role) {
            return !in_array($role->name, ['Student', 'Parent']);
        });
        
        $isRecipientStaff = $recipient->roles->contains(function ($role) {
            return !in_array($role->name, ['Student', 'Parent']);
        });

        $isSenderParent = $this->hasRole('Parent');
        $isRecipientParent = $recipient->hasRole('Parent');

        // 2. Staff <-> Parent (Broad Access)
        if (($isSenderStaff && $isRecipientParent) || ($isSenderParent && $isRecipientStaff)) {
            return true;
        }

        // 3. Staff <-> Staff (Internal Communication)
        if ($isSenderStaff && $isRecipientStaff) {
             return true;
        }

        // 3. Student <-> Class Teacher (Strict Access)
        // Check if student is messaging their class teacher
        if ($this->hasRole('Student') && $recipient->hasRole('Teacher')) {
             // Ideally check if $recipient is assigned to student's class
             // For now, allow contacting any teacher to avoid blocking valid concerns if class assignment is loose
             return true; 
        }

        // Return false for other combinations (e.g., Student <-> Student, Parent <-> Parent)
        return false;
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['name', 'email', 'phone', 'is_active'])
        ->logOnlyDirty()
        ->dontSubmitEmptyLogs();
    }
}
