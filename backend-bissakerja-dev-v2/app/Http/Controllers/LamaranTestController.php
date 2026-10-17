<?php

namespace App\Http\Controllers;

use App\Models\Disabilitas;
use App\Models\Disabilitas;
use App\Models\PelamarLowongan;
use App\Models\UserProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class LamaranTestController extends Controller
{
    /**
     * Mendaftar ke sebuah lowongan kerja
     */
    public function daftar(Request $request, $lowonganId)
    {
        try {
            // $user = User::findOrFail(1);  // Harcode untuk testing
            $user = auth()->user();

            // Validasi role pencari kerja
            if (! $user || $user->role !== 'user') {
                return response()->json([
                    'message' => 'Hanya pencari kerja yang bisa mendaftar lowongan.',
                ], 403);
            }

            // Ambil data lowongan
            $lowongan = PostLowongan::findOrFail($lowonganId);

            // Cek apakah user sudah pernah melamar
            $sudahMelamar = $user->lowonganDilamar()
                ->where('post_lowongan_id', $lowonganId)
                ->exists();

            if ($sudahMelamar) {
                return response()->json([
                    'message' => 'Anda sudah mendaftar pada lowongan ini.',
                ], 409);
            }

            $profile = $user->userProfile;

            if (! $profile || ! $profile->disabilitas_id) {
                return response()->json([
                    'message' => 'Data disabilitas pengguna tidak ditemukan.',
                ], 400);
            }

            $user->lowonganDilamar()->attach($lowonganId, [
                'disabilitas_id' => $profile->disabilitas_id,
                'tanggal_melamar' => now(),
                'status' => 'baru',
            ]);

            return response()->json([
                'message' => 'Berhasil mendaftar lowongan.',
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Gagal mendaftar.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mengambil daftar pelamar untuk lowongan tertentu
     */
    public function daftarPelamar($lowonganId): JsonResponse
    {
        try {
            $lowongan = PostLowongan::findOrFail($lowonganId);

            $pelamar = $lowongan->pelamar()->with('userProfile')->get()->map(function ($user) {
                return [
                    'nama' => $user->nama,
                    'email' => $user->email,
                    'tanggal_melamar' => $user->pivot->tanggal_melamar,
                    'status' => $user->pivot->status,
                ];
            });

            return response()->json([
                'message' => 'Daftar pelamar berhasil diambil.',
                'data' => $pelamar,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Gagal mengambil daftar pelamar.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Memperbarui status lamaran pelamar
     */
    public function updateStatusPelamar(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|string|in:baru,diterima,ditolak',
            ]);

            $pelamar = PelamarLowongan::findOrFail($id);
            $pelamar->status = $request->input('status');
            $pelamar->save();

            return response()->json(['message' => 'Status pelamar berhasil diperbarui.']);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Gagal memperbarui status pelamar.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Menghapus lamaran pelamar
     */
    public function destroy($id)
    {
        try {
            $pelamar = PelamarLowongan::findOrFail($id);
            $pelamar->delete();

            return response()->json(['message' => 'Lamaran pelamar berhasil dihapus.']);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Gagal menghapus lamaran pelamar.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    //     /**
    //  * Menampilkan semua pelamar untuk lowongan perusahaan tertentu
    //  */
    // public function lihatPelamar()
    // {
    //     try {
    //         $user = auth()->user();

    //         $perusahaanProfile = $user->perusahaanProfile;

    //         if (!$perusahaanProfile) {
    //             return response()->json([
    //                 'message' => 'Profil perusahaan tidak ditemukan.'
    //             ], 404);
    //         }

    //         $pelamar = PelamarLowongan::whereHas('postLowongan', function ($query) use ($perusahaanProfile) {
    //                 $query->where('perusahaan_profile_id', $perusahaanProfile->id);
    //             })
    //             ->with(['user', 'user.userProfile'])
    //             ->select('id', 'user_id', 'post_lowongan_id', 'tanggal_melamar', 'status')
    //             ->get()
    //             ->map(function ($item) {
    //                 return [
    //                     'nama'            => $item->user->nama,
    //                     'email'           => $item->user->userProfile->email ?? null,
    //                     'tanggal_melamar' => $item->tanggal_melamar,
    //                     'status'          => $item->status,
    //                 ];
    //             });

    //         return response()->json([
    //             'message' => 'Data pelamar berhasil diambil.',
    //             'data'    => $pelamar
    //         ]);

    //     } catch (\Throwable $e) {
    //         return response()->json([
    //             'message' => 'Gagal mengambil data pelamar.',
    //             'error'   => $e->getMessage()
    //         ], 500);
    //     }
    // }

    // /**
    //  * Menampilkan detail lengkap seorang pelamar berdasarkan ID pelamaran
    //  */
    // public function detailPelamar($id)
    // {
    //     try {
    //            // $perusahaanId = 1; // harcode untuk testing
    //         $user = auth()->user();

    //         if (!$user->perusahaanProfile) {
    //             return response()->json(['message' => 'Hanya perusahaan yang bisa mengakses data ini.'], 403);
    //         }

    //         $perusahaanId = $user->perusahaanProfile->id;

    //         $lamaran = PelamarLowongan::with([
    //             'user.userProfile',
    //             'user.userProfile.disabilitas',
    //             'user.userProfile.pendidikan',
    //             'user.userProfile.pengalamanKerja',
    //             'postLowongan'
    //         ])
    //         ->whereHas('postLowongan', function ($query) use ($perusahaanId) {
    //             $query->where('perusahaan_profile_id', $perusahaanId);
    //         })
    //         ->findOrFail($id);

    //         $user     = $lamaran->user;
    //         $profile  = $user->userProfile;
    //         $lowongan = $lamaran->postLowongan;

    //         $data = [
    //             'nama'              => $user->nama,
    //             'umur'              => $profile->umur,
    //             'disabilitas_id'    => $profile->disabilitas_id,
    //             'pendidikan_id'     => $profile->pendidikan_id,
    //             'pengalaman_id'     => $profile->pengalaman_kerja_id,
    //             'nama_lowongan'     => $lowongan->nama_lowongan ?? null,
    //             'email'             => $profile->email,
    //             'no_telephone'      => $profile->no_telephone,
    //             'status_lamaran'    => $lamaran->status,
    //         ];

    //         return response()->json([
    //             'message' => 'Berhasil menampilkan detail pelamar.',
    //             'data'    => $data
    //         ], 200);

    //     } catch (\Throwable $e) {
    //         return response()->json([
    //             'message' => 'Gagal mengambil detail pelamar.',
    //             'error'   => $e->getMessage()
    //         ], 500);
    //     }
    // }

}
