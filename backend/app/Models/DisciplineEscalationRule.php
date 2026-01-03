<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisciplineEscalationRule extends Model
{
    protected $fillable = [
        'severity',
        'role',
        'school_custom',
    ];
}
