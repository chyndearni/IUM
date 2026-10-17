<?php

namespace Database\Seeders;

use App\Enum\RoleEnum;
use App\Models\AdminProfile;
use App\Models\Disabilitas;
use App\Models\LokasiDomisili;
use App\Models\LokasiKtp;
use App\Models\Province;
use App\Models\Regency;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\Village; // Tambahkan import ini jika ada model Disabilitas
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        foreach (RoleEnum::cases() as $role) {
            Role::create([
                'name' => $role->value,
                'guard_name' => 'api',
            ]);
        }

        // Create dummy super admin account
        $superadmin = User::create([
            'name' => 'Super admin',
            'email' => 'superadmin@jatimbissa.id',
            'password' => Hash::make('password'),
        ]);

        // Create dummy admin account
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@jatimbissa.id',
            'password' => Hash::make('password'),
        ]);

        // Create dummy kandidat account
        $kandidat = User::create([
            'name' => 'Kandidat',
            'email' => 'kandidat@jatimbissa.id',
            'password' => Hash::make('password'),
        ]);

        // Create dummy perusahaan account
        $perusahaan = User::create([
            'name' => 'Perusahaan',
            'email' => 'perusahaan@jatimbissa.id',
            'password' => Hash::make('password'),
        ]);

        $superadmin->assignRole(Role::findByName(RoleEnum::SUPER_ADMIN->value, 'api'));
        $admin->assignRole(Role::findByName(RoleEnum::ADMIN->value, 'api'));
        $kandidat->assignRole(Role::findByName(RoleEnum::USER->value, 'api'));
        $perusahaan->assignRole(Role::findByName(RoleEnum::PERUSAHAAN->value, 'api'));

        // Associate existing Province, Regency, and Village with admin
        $province = Province::where('name', 'JAWA TIMUR')->first();
        $regency = Regency::where('name', 'KOTA SURABAYA')->first();

        if ($province && $regency) {
            $superadmin->adminProfile()->create([
                'user_id' => $superadmin->id,
                'province_id' => $province->id,
            ]);

            $admin->adminProfile()->create([
                'user_id' => $admin->id,
                'province_id' => $province->id,
                'regencie_id' => $regency->id,
            ]);
        }

        // Create dummy admin account
        $adminJawaTengah = User::create([
            'name' => 'Admin Jawa Tengah',
            'email' => 'admin.jateng@jatimbissa.id',
            'password' => Hash::make('password'),
        ]);

        $adminJawaTengah->assignRole(RoleEnum::ADMIN->value);

        $province = Province::where('name', 'JAWA TENGAH')->first();
        $regency = Regency::where('name', 'KOTA SEMARANG')->first();

        if ($province && $regency) {
            $adminJawaTengah->adminProfile()->create([
                'user_id' => $adminJawaTengah->id,
                'province_id' => $province->id,
                'regencie_id' => $regency->id,
            ]);
        }

        // Cek apakah ada data disabilitas yang valid
        // $disabilitasId = null;
        // if (class_exists('App\Models\Disabilitas')) {
        //     $disabilitas = \App\Models\Disabilitas::first();
        //     if ($disabilitas) {
        //         $disabilitasId = $disabilitas->id;
        //     }
        // }

        // // User profile
        // $userProfileData = [
        //     'user_id' => $kandidat->id,
        //     'nik' => '3578123456789012',
        //     'tanggal_lahir' => '2000-01-01',
        //     'jenis_kelamin' => 'L',
        //     'no_telp' => '081234567890',
        //     'latar_belakang' => 'Lulusan S1 Teknik Informatika dengan minat di bidang pemrograman dan AI.',
        //     'status_kawin' => 1,
        // ];

        // Hanya tambahkan disabilitas_id jika ada data yang valid
        // if ($disabilitasId) {
        //     $userProfileData['disabilitas_id'] = $disabilitasId;
        // }

        // $userProfile = UserProfile::create($userProfileData);

        // $provinceId = 35;     // Jawa Timur
        // $regencieId = 3578;   // Kota Surabaya
        // $districtId = 3578210;
        // $villageId = 3578210006;

        // // Buat lokasi KTP
        // $lokasiKtp = LokasiKtp::create([
        //     'user_profile_id' => $userProfile->id,
        //     'province_id' => $provinceId,
        //     'regencie_id' => $regencieId,
        //     'district_id' => $districtId,
        //     'village_id' => $villageId, // isi jika tersedia
        //     'alamat_lengkap' => 'Jl. Kenangan No. 1, Surabaya',
        //     'kode_pos' => '60293',
        // ]);

        // // Buat lokasi domisili (sama dengan lokasi KTP)
        // $lokasiDomisili = LokasiDomisili::create([
        //     'user_profile_id' => $userProfile->id,
        //     'province_id' => $provinceId,
        //     'regencie_id' => $regencieId,
        //     'district_id' => $districtId,
        //     'village_id' => $villageId,
        //     'alamat_lengkap' => 'Jl. Kenangan No. 1, Surabaya',
        //     'kode_pos' => '60293',
        // ]);

        // Generate Account Admin and Super Admin
        $provinces = Province::all();

        foreach ($provinces as $province) {
            // Ambil salah satu regency di provinsi tersebut
            $regency = $province->regencies()->first();

            // Super Admin
            $superAdmin = User::create([
                'name' => $province->name,
                'email' => Str::slug($province->name) . '@jatimbissa.id',
                'password' => bcrypt('password'),
                'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($province->name),
            ]);
            $superAdmin->assignRole(RoleEnum::SUPER_ADMIN->value);

            AdminProfile::create([
                'user_id' => $superAdmin->id,
                'province_id' => $province->id,
            ]);

            // Admin
            foreach ($province->regencies as $regency) {
                $admin = User::create([
                    'name' => $regency->name,
                    'email' => Str::slug($regency->name) . '@jatimbissa.id',
                    'password' => bcrypt('password'),
                    'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($regency->name),
                ]);
                $admin->assignRole(RoleEnum::ADMIN->value);

                AdminProfile::create([
                    'user_id' => $admin->id,
                    'province_id' => $province->id,
                    'regencie_id' => $regency->id,
                ]);
                dump("{$admin->name} created for Regency {$regency->name} in Province {$province->name}");
            }
            dump("{$superAdmin->name} created for Province {$province->name}");
        }
    }
}
