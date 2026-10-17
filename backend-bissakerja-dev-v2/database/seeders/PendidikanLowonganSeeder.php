<?php

namespace Database\Seeders;

use App\Models\PendidikanLowongan;
use Illuminate\Database\Seeder;

class PendidikanLowonganSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['SMA/SMK', 'Diploma', 'Sarjana (S1)', 'Magister (S2)', 'Doktor (S3)'] as $nama) {
            PendidikanLowongan::firstOrCreate(['nama' => $nama]);
        }
    }
}
