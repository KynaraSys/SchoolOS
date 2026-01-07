<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Staff extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'staff_number',
        'national_id_number',
        'employment_type',
        'start_date',
        'end_date',
        'is_active',
        'qualification',
        'tsc_number',
        'specialization',
        'archived_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'archived_at' => 'datetime',
        'national_id_number' => 'encrypted',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
