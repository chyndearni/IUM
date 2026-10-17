<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PelamarLowongan extends Model
{
    use HasFactory;

    protected $table = 'pelamar_lowongan';

    protected $fillable = [
        'user_id',
        'post_lowongan_id',
        'disabilitas_id',
        'tanggal_melamar',
        'status',
    ];

    // Relasi ke User (pelamar)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function postLowongan()
    {
        return $this->belongsTo(PostLowongan::class);
    }

    public function disabilitas()
    {
        return $this->belongsTo(Disabilitas::class);
    }
}
