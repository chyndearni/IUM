<?php

namespace App\Http\Controllers;

use App\Models\Lamaran;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Auth;

class LamaranController extends Controller
{
    public function lamarPekerjaan($id)
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        Lamaran::create([
            'lowongan_id' => $id,
            'user_id' => $user->id,
            'applied_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Lamaran berhasil dikirim']);
    }

    public function cekLamaran($id)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // Gunakan first() bukan firstOrFail() untuk avoid exception
        $lamaran = Lamaran::where('user_id', $user->id)
            ->where('lowongan_id', $id)
            ->first();

        if ($lamaran) {
            // Data ditemukan = sudah dilamar
            return response()->json([
                'success' => true,
                'applied' => true,
                'message' => 'Sudah melamar untuk lowongan ini',
                'data' => $lamaran,
            ], 200);
        } else {
            // Data tidak ditemukan = belum dilamar
            return response()->json([
                'success' => true,
                'applied' => false,
                'message' => 'Belum melamar untuk lowongan ini',
            ], 200);
        }
    }

    public function lamaranSaya()
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $lamaran = Lamaran::with([
            'user',
            'lowongan',
            'lowongan.perusahaanProfile',
            'lowongan.disabilitas',
        ])
            ->where('user_id', $user->id)
            ->get();

        if ($lamaran) {
            // Data ditemukan = sudah dilamar
            return response()->json([
                'success' => true,
                'message' => 'Sudah melamar untuk lowongan ini',
                'data' => $lamaran,
            ], 200);
        } else {
            // Data tidak ditemukan = belum dilamar
            return response()->json([
                'success' => true,
                'message' => 'Belum melamar untuk lowongan ini',
            ], 200);
        }
    }

    public function cekUserProfile()
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $userProfile = UserProfile::where('user_id', $user->id)->first();
        if ($userProfile) {
            return response()->json([
                'success' => true,
                'message' => 'User profile found',
                'userProfileDataExist' => true,
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User profile not found',
                'userProfileDataExist' => false,
            ], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function lihatPelamar($id)
    {
        // Logic to delete an application
    }


    public function masterDataPelamar()
    {
        $lamaran = Lamaran::with([
            'user',
            'lowongan',
            'lowongan.perusahaanProfile',
            'lowongan.disabilitas',
        ])
            ->get();

        if ($lamaran) {
            // Data ditemukan = sudah dilamar
            return response()->json([
                'success' => true,
                'message' => 'Daftar pelamar berhasil diambil',
                'data' => $lamaran,
            ], 200);
        } else {
            // Data tidak ditemukan = belum dilamar
            return response()->json([
                'success' => true,
                'message' => 'Daftar pelamar kosong',
            ], 200);
        }
    }
}
