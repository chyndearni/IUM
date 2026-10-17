<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UndanganTalentPool extends Model
{
    protected $guarded = ['id'];


    public function userProfile(): BelongsTo
    {
        return $this->belongsTo(UserProfile::class);
    }

    public function perusahaanProfile(): BelongsTo
    {
        return $this->belongsTo(PerusahaanProfile::class);
    }

    public function postLowongan(): BelongsTo
    {
        return $this->belongsTo(PostLowongan::class);
    }
}
