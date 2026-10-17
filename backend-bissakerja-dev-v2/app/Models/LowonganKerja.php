<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LowonganKerja extends Model
{
    use HasFactory;

    protected $table = 'lowongan_pekerjaan';

    protected $fillable = [
        'nama',
        'gambar',
        'tipe_pekerjaan_id',
        'min_gaji',
        'max_gaji',
        'disabilitas_id',
        'deskripsi_pekerjaan',
        'lokasi',
        'perusahaan_profile_id',
        'status',
    ];

    // Relasi ke tabel lain
    public function tipePekerjaan()
    {
        return $this->belongsTo(TipePekerjaan::class);
    }

    public function disabilitas()
    {
        return $this->belongsTo(Disabilitas::class);
    }

    public function perusahaan()
    {
        return $this->belongsTo(PerusahaanProfile::class, 'perusahaan_profile_id');
    }
}
