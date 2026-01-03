<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guardian extends Model
{
    use HasFactory;

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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The students (users) that belong to the guardian.
     */
    public function students()
    {
        return $this->belongsToMany(User::class, 'guardian_student', 'guardian_id', 'student_id')
                    ->withPivot('is_primary', 'receives_sms', 'receives_email', 'receives_whatsapp', 'receives_portal', 'receives_calls')
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
        return $query->where(function ($q) use ($term) {
            $q->where('first_name', 'ilike', "%{$term}%")
              ->orWhere('last_name', 'ilike', "%{$term}%")
              ->orWhere('phone_number', 'ilike', "%{$term}%")
              ->orWhere('national_id', 'ilike', "%{$term}%");
        });
    }
}
