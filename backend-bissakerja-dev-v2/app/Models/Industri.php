<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Industri extends Model
{
    /** @use HasFactory<\Database\Factories\IndustriFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['name'];

    public function perusahaanProfile(): HasMany
    {
        return $this->hasMany(PerusahaanProfile::class);
    }
}
