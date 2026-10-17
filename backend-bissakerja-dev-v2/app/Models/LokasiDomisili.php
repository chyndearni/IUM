<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class LokasiDomisili extends Model
{
    /** @use HasFactory<\Database\Factories\LokasiDomisiliFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['kode_pos', 'alamat_lengkap', 'province_id', 'regencie_id', 'district_id', 'village_id', 'user_profile_id'];

    public function userProfile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function regencies(): BelongsTo
    {
        return $this->belongsTo(Regency::class);
    }

    public function districts(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function villages(): BelongsTo
    {
        return $this->belongsTo(Village::class);
    }
}
