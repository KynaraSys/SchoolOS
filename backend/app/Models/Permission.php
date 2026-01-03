<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    // Explicit model allowing for future customization

    protected $fillable = [
        'name',
        'guard_name',
    ];
}
