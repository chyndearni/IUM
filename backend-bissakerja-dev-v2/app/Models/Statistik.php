<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Statistik extends Model
{
    /** @use HasFactory<\Database\Factories\StatistikFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['key', 'value'];
}
