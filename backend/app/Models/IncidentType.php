<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class IncidentType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'severity',
        'points',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'points' => 'integer',
    ];
}
