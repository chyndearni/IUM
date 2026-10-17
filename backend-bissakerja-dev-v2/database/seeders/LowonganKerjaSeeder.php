<?php

namespace Database\Seeders;

use App\Models\CompanyProfil;
use App\Models\ModelKerja;
use App\Models\PerusahaanProfile;
use App\Models\PostLowongan;
use Illuminate\Database\Seeder;

class LowonganKerjaSeeder extends Seeder
{
    public function run(): void
    {

        // Post Lowongan
        $modelKerja = ModelKerja::where('nama', 'Onsite')->first();
        $tipePekerjaan = TipePekerjaan::where('nama', 'Full Time')->first();
        $disabilitas = Disabilitas::where('kategori_disabilitas', 'Tuna Netra')->first();
        $industri = DB::table('industris')->where('name', 'Teknologi Informasi')->first();
        $pendidikanLowongan = DB::table('pendidikan_lowongan')->where('nama', 'S1')->first();
        $pengalamanKerjaLowongan = DB::table('pengalaman_kerja_lowongan')->where('nama', 'Fresh Graduate')->first();

        PostLowongan::create([
            'nama_lowongan' => 'Software Engineer',
            'model_kerja_id' => 1,
            'tipe_pekerjaan_id' => 1,
            'min_gaji' => 5000000,
            'max_gaji' => 10000000,
            'industris_id' => 1,
            'disabilitas_id' => 1,
            'pendidikan_lowongan_id' => 1,
            'pengalaman_kerja_lowongan_id' => 1,
            'deskripsi_pekerjaan' => 'Membangun dan memelihara aplikasi berbasis web.',
            'kualifikasi' => 'Minimal lulusan S1 Teknik Informatika, pengalaman 2 tahun.',
            'benefit' => 'BPJS, THR, bonus proyek',
            'perusahaan_profiles_id' => 3,
            'regencies_id' => '7371',
            'provinces_id' => '73',
            'alamat_lengkap' => 'Jalan Teknologi No. 88, Makassar',
            'status' => 'aktif',
            'expired_date' => now()->addMonth(),

            // // // Seeder untuk CompanyProfil
            // // $company = PerusahaanProfile::firstOrCreate([
            // //     'nama_perusahaan' => 'PT Contoh Sukses',
            // //     'alamat' => 'Jakarta',
            // //     'deskripsi' => 'Perusahaan teknologi',
            // //     'nib' => '1231231443',
            // //     'user_id' => 4,
            // //     'province_id' => 35,
            // //     'regencie_id' => 3578,
            // //     'industri_id' => 1,
            // //     'bukti_wajib_lapor' => 'perusahaan/bukti-wajib-lapor/pdf-file.pdf',
            // //     //            'kategori_perusahaan' => 'Teknologi',

            // ]),
        ]);
    }
}
