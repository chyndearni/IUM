<?php

namespace Database\Seeders;

use App\Models\Disabilitas;
use Illuminate\Database\Seeder;

class DisabilitasSeeder extends Seeder
{
    public function run(): void
    {
        $list = [
            ['kategori_disabilitas' => 'Disabilitas Fisik', 'tingkat_disabilitas' => 'Ringan'],
            ['kategori_disabilitas' => 'Disabilitas Fisik', 'tingkat_disabilitas' => 'Sedang'],
            ['kategori_disabilitas' => 'Disabilitas Fisik', 'tingkat_disabilitas' => 'Berat'],

            ['kategori_disabilitas' => 'Disabilitas Intelektual', 'tingkat_disabilitas' => 'Ringan'],
            ['kategori_disabilitas' => 'Disabilitas Intelektual', 'tingkat_disabilitas' => 'Sedang'],
            ['kategori_disabilitas' => 'Disabilitas Intelektual', 'tingkat_disabilitas' => 'Berat'],

            ['kategori_disabilitas' => 'Disabilitas Mental', 'tingkat_disabilitas' => 'Ringan'],
            ['kategori_disabilitas' => 'Disabilitas Mental', 'tingkat_disabilitas' => 'Sedang'],
            ['kategori_disabilitas' => 'Disabilitas Mental', 'tingkat_disabilitas' => 'Berat'],

            ['kategori_disabilitas' => 'Disabilitas Pendengaran', 'tingkat_disabilitas' => 'Ringan'],
            ['kategori_disabilitas' => 'Disabilitas Pendengaran', 'tingkat_disabilitas' => 'Sedang'],
            ['kategori_disabilitas' => 'Disabilitas Pendengaran', 'tingkat_disabilitas' => 'Berat'],

            ['kategori_disabilitas' => 'Disabilitas Penglihatan', 'tingkat_disabilitas' => 'Ringan'],
            ['kategori_disabilitas' => 'Disabilitas Penglihatan', 'tingkat_disabilitas' => 'Sedang'],
            ['kategori_disabilitas' => 'Disabilitas Penglihatan', 'tingkat_disabilitas' => 'Berat'],

            ['kategori_disabilitas' => 'Disabilitas Wicara', 'tingkat_disabilitas' => 'Ringan'],
            ['kategori_disabilitas' => 'Disabilitas Wicara', 'tingkat_disabilitas' => 'Sedang'],
            ['kategori_disabilitas' => 'Disabilitas Wicara', 'tingkat_disabilitas' => 'Berat'],
        ];

        foreach ($list as $item) {
            Disabilitas::firstOrCreate($item);
        }
    }
}
