<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pendidikan extends Model
{
    /** @use HasFactory<\Database\Factories\PendidikanFactory> */
    use HasFactory;

    protected $fillable = ['tingkat', 'bidang_studi', 'nilai', 'tanggal_mulai', 'tanggal_akhir', 'lokasi', 'deskripsi', 'ijazah', 'resume_id'];

    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class);
    }
}
