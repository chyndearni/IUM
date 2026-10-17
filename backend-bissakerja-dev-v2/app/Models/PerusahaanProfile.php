<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PerusahaanProfile extends Model
{
    use HasFactory;

    protected $table = 'perusahaan_profiles'; // Sesuaikan dengan nama tabel Anda

    protected $fillable = [
        'user_id',
        'logo',
        'nama_perusahaan',
        'industri',
        'tahun_berdiri',
        'jumlah_karyawan',
        'province_id',
        'regencie_id',
        'deskripsi',
        'no_telp',
        'link_website',
        'alamat_lengkap',
        'visi',
        'misi',
        'nilai_nilai',
        'sertifikat',
        'bukti_wajib_lapor',
        'nib',
        'status_verifikasi',
        'linkedin',
        'instagram',
        'facebook',
        'twitter',
        'youtube',
        'tiktok',
    ];

    protected $casts = [
        'nilai_nilai' => 'array',
        'sertifikat' => 'array',
    ];

    /**
     * Relasi ke model User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke model Lowongan yang dimiliki perusahaan
     */
    public function lowongan()
    {
        return $this->hasMany(PostLowongan::class, 'perusahaan_profile_id');
    }

    /**
     * Relationship dengan Province
     */
    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id', 'id');
    }

    /**
     * Relationship dengan Regency
     */
    public function regency()
    {
        return $this->belongsTo(Regency::class, 'regencie_id', 'id');
    }

    /**
     * Relasi ke kecamatan
     */
    public function industri()
    {
        return $this->belongsTo(Industri::class, 'industri_id', 'id');
    }

    /**
     * Accessor untuk logo URL
     */
    public function getLogoUrlAttribute()
    {
        if ($this->logo) {
            return asset('storage/' . $this->logo);
        }

        return null;
    }

    /**
     * Accessor untuk bukti wajib lapor URL
     */
    public function getBuktiWajibLaporUrlAttribute()
    {
        if ($this->bukti_wajib_lapor) {
            return asset('storage/' . $this->bukti_wajib_lapor);
        }

        return null;
    }

    /**
     * Get all of the undangan_talent_pool for the PerusahaanProfile
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function undangan_talent_pool(): HasMany
    {
        return $this->hasMany(UndanganTalentPool::class);
    }
}
