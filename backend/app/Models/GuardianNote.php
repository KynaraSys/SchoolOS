<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuardianNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'guardian_id',
        'user_id',
        'content',
    ];

    public function guardian()
    {
        return $this->belongsTo(Guardian::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
