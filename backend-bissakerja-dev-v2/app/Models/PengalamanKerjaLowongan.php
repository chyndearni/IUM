<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengalamanKerjaLowongan extends Model
{
    use HasFactory;

    protected $table = 'pengalaman_kerja_lowongan';

    protected $fillable = [
        'nama',
    ];
}
