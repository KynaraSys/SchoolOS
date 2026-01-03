<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    // Explicit model allowing for future customization
    
    protected $fillable = [
        'name',
        'guard_name',
    ];
}
