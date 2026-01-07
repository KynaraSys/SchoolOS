<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Guardian extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'first_name',
        'last_name',
        'phone_number',
        'email',
        'national_id',
        'relationship_type',
        'address',
        'occupation',
        'is_active',
        'user_id',
        'receives_sms',
        'receives_email',
        'receives_whatsapp',
        'receives_portal',
        'receives_calls',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        // 'email' => 'encrypted',
        // 'phone_number' => 'encrypted',
        // 'national_id' => 'encrypted',
        // 'address' => 'encrypted',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The students (users) that belong to the guardian.
     */
    public function students()
    {
        return $this->belongsToMany(Student::class, 'guardian_student', 'guardian_id', 'student_id')
                    ->withPivot('relationship_type', 'is_primary', 'receives_sms', 'receives_email', 'receives_whatsapp', 'receives_portal', 'receives_calls')
                    ->withTimestamps();
    }

    public function notes()
    {
        return $this->hasMany(GuardianNote::class);
    }

    public function documents()
    {
        return $this->hasMany(GuardianDocument::class);
    }

    /**
     * Scope to search guardians by name or phone.
     */
    public function scopeSearch($query, $term)
    {
        $term = str_replace(' ', '', $term);
        return $query->where(function ($q) use ($term) {
            $q->whereRaw("REPLACE(first_name, ' ', '') LIKE ?", ["%{$term}%"])
              ->orWhereRaw("REPLACE(last_name, ' ', '') LIKE ?", ["%{$term}%"])
              // Phone and ID are encrypted, strictly speaking LIKE won't work on ciphertext, 
              // but keeping logic consistent with previous intent if they were plain text.
              ->orWhereRaw("REPLACE(phone_number, ' ', '') LIKE ?", ["%{$term}%"])
              ->orWhereRaw("REPLACE(national_id, ' ', '') LIKE ?", ["%{$term}%"]);
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['first_name', 'last_name', 'phone_number', 'email', 'is_active'])
        ->logOnlyDirty()
        ->dontSubmitEmptyLogs()
        ->setDescriptionForEvent(fn(string $eventName) => "{$eventName} guardian {$this->first_name} {$this->last_name}");
    }
}
