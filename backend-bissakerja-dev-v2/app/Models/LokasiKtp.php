<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LokasiKtp extends Model
{
    /** @use HasFactory<\Database\Factories\LokasiKtpFactory> */
    use HasFactory;

    protected $table = 'lokasi_user_profiles';

    protected $fillable = [
        'kode_pos_ktp',
        'alamat_lengkap_ktp',
        'province_ktp_id',
        'regencie_ktp_id',
        'district_ktp_id',
        'village_ktp_id',
        'kode_pos_domisili',
        'alamat_lengkap_domisili',
        'province_domisili_id',
        'regencie_domisili_id',
        'district_domisili_id',
        'village_domisili_id',
        'user_profile_id',
    ];

    protected $dates = ['deleted_at'];

    // Relationship dengan UserProfile
    public function userProfile()
    {
        return $this->belongsTo(UserProfile::class);
    }

    // Relasi ke Province
    public function province()
    {
        return $this->belongsTo(Province::class, 'province_ktp_id', 'id');
    }

    // Relasi ke Regency
    public function regency()
    {
        return $this->belongsTo(Regency::class, 'regencie_ktp_id', 'id');
    }

    // Relasi ke District
    public function district()
    {
        return $this->belongsTo(District::class, 'district_ktp_id', 'id');
    }

    // Relasi ke Village
    public function village()
    {
        return $this->belongsTo(Village::class, 'village_ktp_id', 'id');
    }

    // Relasi ke Province untuk Domisili
    public function provinceDomisili()
    {
        return $this->belongsTo(Province::class, 'province_domisili_id', 'id');
    }

    // Relasi ke Regency untuk Domisili
    public function regencyDomisili()
    {
        return $this->belongsTo(Regency::class, 'regencie_domisili_id', 'id');
    }

    // Relasi ke District untuk Domisili
    public function districtDomisili()
    {
        return $this->belongsTo(District::class, 'district_domisili_id', 'id');
    }

    // Relasi ke Village untuk Domisili
    public function villageDomisili()
    {
        return $this->belongsTo(Village::class, 'village_domisili_id', 'id');
    }
}
