<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuardianDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'guardian_id',
        'title',
        'file_path',
        'file_type',
        'file_size',
        'uploaded_by',
    ];

    public function guardian()
    {
        return $this->belongsTo(Guardian::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
