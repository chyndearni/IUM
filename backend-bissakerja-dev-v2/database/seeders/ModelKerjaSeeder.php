<?php

namespace Database\Seeders;

use App\Models\ModelKerja;
use Illuminate\Database\Seeder;

class ModelKerjaSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Onsite', 'Remote', 'Hybrid'] as $nama) {
            ModelKerja::firstOrCreate(['nama' => $nama]);
        }
    }
}
