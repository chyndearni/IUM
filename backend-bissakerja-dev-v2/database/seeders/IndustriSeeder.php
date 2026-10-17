<?php

namespace Database\Seeders;

use App\Models\Industri;
use Illuminate\Database\Seeder;

class IndustriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $industries = [
            ['name' => 'Teknologi Informasi'],
            ['name' => 'Manufaktur'],
            ['name' => 'Kesehatan dan Farmasi'],
            ['name' => 'Pendidikan'],
            ['name' => 'Transportasi dan Logistik'],
            ['name' => 'Perbankan dan Keuangan'],
            ['name' => 'Energi dan Sumber Daya Alam'],
            ['name' => 'Pertanian dan Perikanan'],
            ['name' => 'Konstruksi dan Properti'],
            ['name' => 'Retail dan Perdagangan'],
            ['name' => 'Media dan Hiburan'],
            ['name' => 'Pariwisata dan Perhotelan'],
            ['name' => 'Makanan dan Minuman'],
            ['name' => 'Tekstil dan Pakaian'],
            ['name' => 'Otomotif'],
            ['name' => 'Kimia dan Material'],
            ['name' => 'Elektronik'],
            ['name' => 'Telekomunikasi'],
            ['name' => 'Periklanan dan Desain'],
            ['name' => 'Keamanan dan Pertahanan'],
            ['name' => 'Layanan Konsultasi'],
            ['name' => 'E-commerce'],
            ['name' => 'Teknologi Keuangan (Fintech)'],
            ['name' => 'Asuransi'],
            ['name' => 'Pelayanan Publik dan Pemerintahan'],
        ];

        foreach ($industries as $industry) {
            Industri::create($industry);
        }
    }
}
