<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostLowongan extends Model
{
    use HasFactory;

    protected $table = 'post_lowongan';

    protected $fillable = [
        'job_title',
        'job_type',
        'description',
        'responsibilities',
        'requirements',
        'education',
        'experience',
        'salary_range',
        'benefits',
        'location',
        'application_deadline', // ubah dari 'application_deadline'
        'accessibility_features',
        'work_accommodations',
        'skills',
        'perusahaan_profile_id',
    ];

    protected $casts = [
        'skills' => 'array', // casting JSON ke array
        'application_deadline' => 'date',
    ];

    public function perusahaanProfile()
    {
        return $this->belongsTo(PerusahaanProfile::class);
    }


    public function disabilitas()
    {
        return $this->belongsToMany(Disabilitas::class, 'post_lowongan_disabilitas');
    }

    public function lamaran()
    {
        return $this->hasMany(Lamaran::class, 'lowongan_id');
    }

    public function tipePekerjaan()
    {
        return $this->belongsTo(TipePekerjaan::class);
    }

    public function pelamar()
    {
        return $this->belongsToMany(User::class, 'pelamar_lowongan', 'post_lowongan_id', 'user_id')
            ->withPivot(['status', 'disabilitas_id', 'tanggal_melamar'])
            ->withTimestamps();
    }

    public function pelamarLowongan()
    {
        return $this->hasMany(PelamarLowongan::class, 'post_lowongan_id');
    }

    public function pendidikanLowongan()
    {
        return $this->hasMany(PendidikanLowongan::class, 'post_lowongan_id');
    }

    public function pengalamanKerjaLowongan()
    {
        return $this->hasMany(PengalamanKerjaLowongan::class, 'post_lowongan_id');
    }

    public function industri()
    {
        return $this->belongsTo(Industri::class, 'industris_id');
    }

    public function modelKerja()
    {
        return $this->belongsTo(ModelKerja::class, 'model_kerja_id');
    }

    public function regency()
    {
        return $this->belongsTo(Regency::class, 'regencies_id');
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'provinces_id');
    }

    public function district()
    {
        return $this->belongsTo(District::class, 'districts_id');
    }
}
