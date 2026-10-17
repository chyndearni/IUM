<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bahasa extends Model
{
    /** @use HasFactory<\Database\Factories\BahasaFactory> */
    use HasFactory;

    protected $fillable = ['name', 'tingkat', 'resume_id'];

    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class);
    }
}
