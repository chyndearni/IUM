<?php

namespace Database\Seeders;

use App\Models\TipePekerjaan;
use Illuminate\Database\Seeder;

class TipePekerjaanSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Full Time', 'Part Time', 'Kontrak'] as $nama) {
            TipePekerjaan::firstOrCreate(['nama' => $nama]);
        }
    }
}
