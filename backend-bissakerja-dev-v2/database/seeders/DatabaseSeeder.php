<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // RoleSeeder::class,

            // LowonganKerjaSeeder::class,

            DisabilitasSeeder::class,
            IndoRegionSeeder::class,
            AccountSeeder::class,
            // PendidikanSeeder::class,
            // TipePekerjaanSeeder::class,
            // ModelKerjaSeeder::class,
            // KeterampilanSeeder::class,
            // PerusahaanSeeder::class,
            DisabilitasSeeder::class,
            // PengalamanKerjaSeeder::class,
            // UserSeeder::class,
            PendidikanLowonganSeeder::class,
            PengalamanKerjaLowonganSeeder::class,

            IndustriSeeder::class,
            // LowonganKerjaSeeder::class,

        ]);
    }
}
