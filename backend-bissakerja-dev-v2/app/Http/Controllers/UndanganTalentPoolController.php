<?php

namespace App\Http\Controllers;

use App\Models\PostLowongan;
use App\Models\UndanganTalentPool;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UndanganTalentPoolController extends Controller
{


    public function test()
    {
        $data = Auth::user()->userProfile->id;

        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }


    public function getAll()
    {
        $dataUser = User::with([
            'userProfile',
            'userProfile.disabilitas',
            'userProfile.lokasi',
            'userProfile.lokasi.provinceDomisili',
            'userProfile.lokasi.regencyDomisili',
            'userProfile.resume',
            'userProfile.resume.keterampilan',

        ])
            ->whereHas('userProfile')
            ->get();

        return response()->json([
            'status' => true,
            'user'   => $dataUser,
        ]);
    }


    public function getProfile($id)
    {
        try {
            $user = User::with([
                'userProfile',
                'userProfile.disabilitas',
                'userProfile.lokasi',
                'userProfile.lokasi.province',
                'userProfile.lokasi.regency',
                'userProfile.lokasi.district',
                'userProfile.lokasi.village',
                'userProfile.lokasi.provinceDomisili',
                'userProfile.lokasi.regencyDomisili',
                'userProfile.lokasi.districtDomisili',
                'userProfile.lokasi.villageDomisili',
                'userProfile.resume',
                'userProfile.resume.bahasa',
                'userProfile.resume.keterampilan',
                'userProfile.resume.pendidikan',
                'userProfile.resume.pencapaian',
                'userProfile.resume.pelatihan',
                'userProfile.resume.sertifikasi',
                'userProfile.resume.pengalamanKerja',
            ])->findOrFail($id);

            if (! $user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data resume berhasil diambil.',
                'data' => $user,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data resume.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getMyJob(Request $request)
    {
        // Pastikan user sudah terautentikasi lewat Sanctum
        $user = $request->user(); // sama dengan Auth::user() jika pakai auth:sanctum
        if (!$user) {
            return response()->json([
                'status'  => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Ambil ID profil perusahaan terlebih dulu; jika tidak ada, fallback ke userProfile (kalau memang desainnya begitu)
        $companyProfile = $user->perusahaanProfile ?? $user->userProfile ?? null;

        // Jika tidak punya profil sama sekali, kembalikan array kosong atau 404 sesuai kebutuhan
        if (!$companyProfile) {
            return response()->json([
                'status' => true,
                'data'   => [],
                'note'   => 'User tidak memiliki perusahaanProfile/userProfile.',
            ]);
            // Atau:
            // return response()->json(['status' => false, 'message' => 'Profil perusahaan tidak ditemukan'], 404);
        }

        $companyId = $companyProfile->id;

        // Ambil lowongan milik perusahaan tersebut
        $dataMyJob = PostLowongan::where('perusahaan_profile_id', $companyId)
            ->latest('created_at')
            ->get();

        // Bentuk response konsisten agar sesuai handler di Next.js
        return response()->json([
            'status' => true,
            'data'   => $dataMyJob,
        ]);
    }


    public function myTalent(Request $request)
    {
        $user = $request->user();
        $myTalentData = UndanganTalentPool::where('perusahaan_profile_id', $user->perusahaanProfile->id)->get();
        $myTalentData->load([
            'userProfile.user',
            'userProfile',
            'userProfile.disabilitas',
            'userProfile.lokasi',
            'userProfile.lokasi.provinceDomisili',
            'userProfile.lokasi.regencyDomisili',
            'userProfile.resume',
            'userProfile.resume.keterampilan',
            'postLowongan',
            'perusahaanProfile'
        ]);

        return response()->json([
            'status' => true,
            'data' => $myTalentData
        ]);
    }


    public function sendInvitations(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => false, 'message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'user_profile_id'  => ['required', 'integer', Rule::exists('user_profiles', 'id')],
            'post_lowongan_id' => ['required', 'integer', Rule::exists('post_lowongan', 'id')],
            'salary_min'       => ['nullable', 'integer', 'min:0', 'lte:salary_max'],
            'salary_max'       => ['nullable', 'integer', 'min:0', 'gte:salary_min'],
        ]);

        // Ambil lowongan dan perusahaan pemiliknya
        $lowongan = PostLowongan::with(['perusahaanProfile:id,user_id'])
            ->find($validated['post_lowongan_id']);

        if (!$lowongan) {
            return response()->json(['status' => false, 'message' => 'Lowongan tidak ditemukan'], 404);
        }

        // Validasi kepemilikan: user yang login harus pemilik perusahaan dari lowongan tsb
        // (pakai perusahaanProfile->user_id, sesuai relasi di model User)
        $ownsLowongan = $lowongan->perusahaanProfile
            && (int) $lowongan->perusahaanProfile->user_id === (int) $user->id;

        if (!$ownsLowongan) {
            return response()->json([
                'status'  => false,
                'message' => 'Anda tidak berhak mengirim undangan untuk lowongan ini.',
            ], 403);
        }

        // Susun payload — sumber kebenaran perusahaan_profile_id diambil dari lowongan
        $payload = [
            'user_profile_id'       => $validated['user_profile_id'],
            'post_lowongan_id'      => $lowongan->id,
            'perusahaan_profile_id' => $lowongan->perusahaan_profile_id,
            'salary_min'            => $validated['salary_min'] ?? null,
            'salary_max'            => $validated['salary_max'] ?? null,
            'status'                => 'Menunggu',
        ];

        // Idempotent: hindari duplikasi untuk kombinasi kandidat + lowongan + perusahaan
        $invitation = DB::transaction(function () use ($payload) {
            return UndanganTalentPool::firstOrCreate(
                [
                    'user_profile_id'       => $payload['user_profile_id'],
                    'post_lowongan_id'      => $payload['post_lowongan_id'],
                    'perusahaan_profile_id' => $payload['perusahaan_profile_id'],
                ],
                $payload
            );
        });

        $invitation->load(['userProfile', 'postLowongan', 'perusahaanProfile']);

        return response()->json([
            'status'  => true,
            'message' => $invitation->wasRecentlyCreated ? 'Invitation created' : 'Invitation already exists',
            'data'    => $invitation,
        ], $invitation->wasRecentlyCreated ? 201 : 200);
    }



    // POV - User
    public function getInvitationUser(Request $request)
    {
        $user = $request->user();

        $dataInvitations = UndanganTalentPool::where('user_profile_id', $user->userProfile->id)->get();
        $dataInvitations->load(['userProfile', 'postLowongan', 'perusahaanProfile']);

        return response()->json([
            'status' => true,
            'message' => 'Get my invitations successfully',
            'data' => $dataInvitations
        ]);
    }

    public function updateStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:Menunggu,Diterima,Ditolak,Wawancara,Dibatalkan,Dipekerjakan',
        ]);
        $inv = UndanganTalentPool::findOrFail($id);
        $inv->update(['status' => $validated['status']]);
        return response()->json([
            'status' => true,
            'data'   => $inv,
        ]);
    }
}
