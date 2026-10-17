<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pelatihan extends Model
{
    /** @use HasFactory<\Database\Factories\PelatihanFactory> */
    use HasFactory;

    protected $fillable = ['name', 'penyelenggara', 'tanggal_mulai', 'tanggal_akhir', 'deskripsi', 'sertifikat_file', 'resume_id'];

    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class);
    }
}
