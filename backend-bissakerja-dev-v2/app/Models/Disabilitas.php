<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Disabilitas extends Model
{
    use HasFactory;

    protected $table = 'disabilitas';

    protected $fillable = [
        'kategori_disabilitas',
        'tingkat_disabilitas',
    ];

    public function postLowongan()
    {
        return $this->belongsToMany(PostLowongan::class, 'post_lowongan_disabilitas');
    }

    public function userProfiles(): HasMany
    {
        return $this->hasMany(UserProfile::class, 'disabilitas_id');
    }

    public function lowongan()
    {
        return $this->hasMany(LowonganKerja::class, 'disabilitas_id');
    }
}
