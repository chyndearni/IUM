<?php

/*
 * This file is part of the IndoRegion package.
 *
 * (c) Azis Hapidin <azishapidin.com | azishapidin@gmail.com>
 *
 */

namespace App\Models;

use AzisHapidin\IndoRegion\Traits\ProvinceTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Province Model.
 */
class Province extends Model
{
    use ProvinceTrait;

    /**
     * Table name.
     *
     * @var string
     */
    protected $table = 'provinces';

    protected $keyType = 'string'; // wajib kalau id-nya bukan integer

    protected $fillable = ['id', 'name'];

    public $incrementing = false;

    /**
     * Province has many regencies.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function regencies()
    {
        return $this->hasMany(Regency::class, 'province_id', 'id');
    }

    public function perusahaanProfiles()
    {
        return $this->hasMany(PerusahaanProfile::class, 'province_id', 'id');
    }

    public function adminProfile(): HasMany
    {
        return $this->hasMany(AdminProfile::class);
    }

    public function lokasi()
    {
        return $this->hasMany(LokasiKtp::class, 'province_ktp_id', 'id');
    }

    public function lokasiDomisili()
    {
        return $this->hasMany(LokasiKtp::class, 'province_domisili_id', 'id');
    }
}
