<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostLowonganDisabilitas extends Model
{
    protected $table = 'post_lowongan_disabilitas';

    protected $fillable = [
        'post_lowongan_id',
        'disabilitas_id',
    ];

    public function postLowongan()
    {
        return $this->belongsTo(PostLowongan::class, 'post_lowongan_id');
    }

    public function disabilitas()
    {
        return $this->belongsTo(Disabilitas::class, 'disabilitas_id');
    }
}
