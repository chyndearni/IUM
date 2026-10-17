<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ModelKerja extends Model
{
    use HasFactory;

    protected $table = 'model_kerja';

    protected $fillable = [
        'nama',
    ];

    public function lowongan()
    {
        return $this->hasMany(PostLowongan::class);
    }
}
