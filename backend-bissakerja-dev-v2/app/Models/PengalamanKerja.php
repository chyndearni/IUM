<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PengalamanKerja extends Model
{
    /** @use HasFactory<\Database\Factories\PengalamanKerjaFactory> */
    use HasFactory;

    protected $fillable = ['name', 'nama_perusahaan', 'tipe_pekerjaan', 'lokasi', 'tanggal_mulai', 'tanggal_akhir', 'deskripsi', 'sertifikat_file', 'resume_id', 'status'];

    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class);
    }
}
