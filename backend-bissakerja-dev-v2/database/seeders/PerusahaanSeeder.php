<?php

namespace Database\Seeders;

use App\Models\PerusahaanProfile;
use Illuminate\Database\Seeder;

class PerusahaanSeeder extends Seeder
{
    public function run(): void
    {
        PerusahaanProfile::firstOrCreate([
            'nama_perusahaan' => 'PT Semoga Sukses',
            'NIB' => 'PKQ0123456',
            'user_id' => 1,
            'industri_id' => 1,
            'alamat' => 'JL. Barombong No. 123, Makassar',
            'deskripsi' => 'Perusahaan yang bergerak di bidang teknologi informasi.',
            'link_website' => 'https://semogasukses.co.id',
            'no_telephone' => '082211223344',
            'status_verifikasi' => 'terverifikasi',
            'bukti_wajib_lapor' => 'laporan.pdf',
            'regencie_id' => '7371',
            'province_id' => '73',
        ]);
    }
}
