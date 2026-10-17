<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lamaran extends Model
{
    protected $table = 'lamarans';

    protected $fillable = [
        'lowongan_id',
        'user_id',
        'status',
        'feedback',
        'type',
        'location',
        'link_meeting',
        'applied_at',
        'reviewed_at',
        'accepted_at',
        'rejected_at',
    ];

    public function lowongan()
    {
        return $this->belongsTo(PostLowongan::class, 'lowongan_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
