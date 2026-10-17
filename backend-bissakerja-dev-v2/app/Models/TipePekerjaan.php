<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipePekerjaan extends Model
{
    use HasFactory;

    protected $table = 'tipe_pekerjaan';

    protected $fillable = ['nama'];

    public function lowongan()
    {
        return $this->hasMany(LowonganKerja::class, 'tipe_pekerjaan_id');
    }
}
