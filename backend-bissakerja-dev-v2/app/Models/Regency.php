<?php

/*
 * This file is part of the IndoRegion package.
 *
 * (c) Azis Hapidin <azishapidin.com | azishapidin@gmail.com>
 *
 */

namespace App\Models;

use AzisHapidin\IndoRegion\Traits\RegencyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Regency Model.
 */
class Regency extends Model
{
    use RegencyTrait;

    /**
     * Table name.
     *
     * @var string
     */
    protected $table = 'regencies';

    protected $keyType = 'string'; // wajib kalau id-nya bukan integer

    protected $fillable = ['id', 'province_id', 'name'];

    public $incrementing = false;

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'province_id',
    ];

    /**
     * Regency belongs to Province.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id', 'id');
    }

    public function perusahaanProfiles()
    {
        return $this->hasMany(PerusahaanProfile::class, 'regencie_id', 'id');
    }

    /**
     * Regency has many districts.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function districts()
    {
        return $this->hasMany(District::class);
    }

    public function adminProfile(): HasMany
    {
        return $this->hasMany(AdminProfile::class);
    }

    public function lokasiDomisili(): HasMany
    {
        return $this->hasMany(LokasiDomisili::class);
    }

    public function lokasiKtp(): HasMany
    {
        return $this->hasMany(LokasiKtp::class);
    }
}
