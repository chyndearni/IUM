<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Resume extends Model
{
    /** @use HasFactory<\Database\Factories\ResumeFactory> */
    use HasFactory;

    protected $fillable = ['user_profile_id', 'ringkasan_pribadi'];

    public function userProfile(): BelongsTo
    {
        return $this->belongsTo(UserProfile::class);
    }

    public function bahasa(): HasMany
    {
        return $this->hasMany(Bahasa::class);
    }

    public function keterampilan(): HasMany
    {
        return $this->hasMany(Keterampilan::class);
    }

    public function pendidikan(): HasMany
    {
        return $this->hasMany(Pendidikan::class);
    }

    public function pencapaian(): HasMany
    {
        return $this->hasMany(Pencapaian::class);
    }

    public function pelatihan(): HasMany
    {
        return $this->hasMany(Pelatihan::class);
    }

    public function sertifikasi(): HasMany
    {
        return $this->hasMany(Sertifikasi::class);
    }

    public function pengalamanKerja(): HasMany
    {
        return $this->hasMany(PengalamanKerja::class);
    }
}
