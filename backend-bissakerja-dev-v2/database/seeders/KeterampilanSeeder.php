<?php

namespace Database\Seeders;

use App\Models\Keterampilan;
use Illuminate\Database\Seeder;

class KeterampilanSeeder extends Seeder
{
    public function run(): void
    {
        Keterampilan::firstOrCreate(['nama_keterampilan' => 'Laravel Developer']);

    }
}
