<?php

namespace Database\Seeders;

use App\Models\PengalamanKerjaLowongan;
use Illuminate\Database\Seeder;

class PengalamanKerjaLowonganSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Fresh Graduate', '1-2 Tahun', '3-5 Tahun', 'Lebih dari 5 Tahun'] as $nama) {
            PengalamanKerjaLowongan::firstOrCreate(['nama' => $nama]);
        }
    }
}
