<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Tambahkan data roles jika belum ada
        DB::table('roles')->insertOrIgnore([
            ['id' => 1, 'nama' => 'Admin'],
            ['id' => 2, 'nama' => 'User'],
            ['id' => 3, 'nama' => 'Perusahaan'],
        ]);

        // Buat user baru
        $user = User::firstOrCreate(
            ['email' => 'pelamar@example.com'],
            [
                'nama' => 'Pelamar Test',
                'avatar' => 'default.png',
                'password' => Hash::make('password'),
                'role_id' => 2, // Role ID untuk 'User'
            ]);
    }
}
