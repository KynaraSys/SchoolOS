<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

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
        'failed_login_attempts',
        'locked_until',
        'is_active',
        'last_login_at',
        'is_super_admin',
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
        'locked_until' => 'datetime',
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
        'is_super_admin' => 'boolean',
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
     * Relationship: Get the student profile associated with the user.
     */
    public function student()
    {
        return $this->hasOne(Student::class);
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
     * Get the primary guardian.
     */
    public function scopePrimaryGuardian($query)
    {
        return $query->whereHas('guardians', function ($q) {
            $q->where('is_primary', true);
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
        // 1. Super Admin / Admin can message anyone, and anyone can message them.
        if ($this->hasRole('Admin') || $this->is_super_admin || $recipient->hasRole('Admin') || $recipient->is_super_admin) {
            return true;
        }

        // Define generic "Staff" roles (add more as needed)
        $staffRoles = ['Teacher', 'Principal', 'Bursar', 'Secretary', 'ICT Admin'];
        $isSenderStaff = $this->hasAnyRole($staffRoles);
        $isRecipientStaff = $recipient->hasAnyRole($staffRoles);

        $isSenderParent = $this->hasRole('Parent');
        $isRecipientParent = $recipient->hasRole('Parent');

        // 2. Staff <-> Parent (Broad Access)
        if (($isSenderStaff && $isRecipientParent) || ($isSenderParent && $isRecipientStaff)) {
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
}
