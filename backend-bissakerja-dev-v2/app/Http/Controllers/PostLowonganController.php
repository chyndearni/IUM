<?php

namespace App\Http\Controllers;

use App\Models\Disabilitas;
use App\Models\Lamaran;
use App\Models\PostLowongan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PostLowonganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $lowongans = PostLowongan::with(['perusahaanProfile', 'disabilitas'])
                ->where('perusahaan_profile_id', Auth::user()->perusahaanProfile->id)
                ->latest()
                ->get();

            $formatted = $lowongans->map(function ($lowongan) {
                return [
                    'id' => $lowongan->id,
                    'job_title' => $lowongan->job_title,
                    'job_type' => $lowongan->job_type,
                    'description' => $lowongan->description,
                    'responsibilities' => $lowongan->responsibilities,
                    'requirements' => $lowongan->requirements,
                    'education' => $lowongan->education,
                    'experience' => $lowongan->experience,
                    'salary_range' => $lowongan->salary_range,
                    'benefits' => $lowongan->benefits,
                    'location' => $lowongan->location,
                    'application_deadline' => $lowongan->application_deadline,
                    'accessibility_features' => $lowongan->accessibility_features,
                    'work_accommodations' => $lowongan->work_accommodations,
                    'skills' => $lowongan->skills,
                    'perusahaan_profile' => $lowongan->perusahaanProfile,
                    'disabilitas' => $lowongan->disabilitas,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Daftar lowongan berhasil diambil',
                'data' => $formatted,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data lowongan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $companyProfile = Auth::user()->perusahaanProfile;

        if (! $companyProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya perusahaan yang dapat membuat lowongan.',
            ], 403);
        }

        try {
            // Validasi input
            $validated = $request->validate([
                'jobTitle' => 'required|string|max:255',
                'jobType' => 'required|string|max:100',
                'description' => 'nullable|string',
                'responsibilities' => 'nullable|string',
                'requirements' => 'nullable|string',
                'education' => 'nullable|string|max:255',
                'experience' => 'nullable|string|max:255',
                'salaryRange' => 'nullable|string|max:255',
                'benefits' => 'nullable|string',
                'location' => 'nullable|string|max:255',
                'applicationDeadline' => 'nullable|date',
                'accessibilityFeatures' => 'nullable|string',
                'workAccommodations' => 'nullable|string',
                'skills' => 'nullable|array',
                'skills.*' => 'string',
                'disabilityIds' => 'nullable|array',
                'disabilityIds.*' => 'integer|exists:disabilitas,id',
            ]);

            // Mulai database transaction
            DB::beginTransaction();

            // Siapkan data untuk post_lowongan
            $postLowonganData = [
                'job_title' => $validated['jobTitle'],
                'job_type' => $validated['jobType'],
                'description' => $validated['description'] ?? null,
                'responsibilities' => $validated['responsibilities'] ?? null,
                'requirements' => $validated['requirements'] ?? null,
                'education' => $validated['education'] ?? null,
                'experience' => $validated['experience'] ?? null,
                'salary_range' => $validated['salaryRange'] ?? null,
                'benefits' => $validated['benefits'] ?? null,
                'location' => $validated['location'] ?? null,
                'application_deadline' => $validated['applicationDeadline'] ?? null,
                'accessibility_features' => $validated['accessibilityFeatures'] ?? null,
                'work_accommodations' => $validated['workAccommodations'] ?? null,
                'skills' => $validated['skills'] ?? [],
                'perusahaan_profile_id' => $companyProfile->id,
                'created_at' => $validated['created_at'] ?? now(),
                'updated_at' => $validated['updated_at'] ?? now(),
            ];

            $postLowongan = PostLowongan::create($postLowonganData);

            // Attach disabilitas jika ada
            if (! empty($validated['disabilityIds'])) {
                $postLowongan->disabilitas()->attach($validated['disabilityIds']);
            }

            DB::commit();

            $postLowongan->load(['disabilitas', 'perusahaanProfile']);

            return response()->json([
                'success' => true,
                'message' => 'Lowongan berhasil dibuat',
                'data' => [
                    'id' => $postLowongan->id,
                    'job_title' => $postLowongan->job_title,
                    'job_type' => $postLowongan->job_type,
                    'description' => $postLowongan->description,
                    'responsibilities' => $postLowongan->responsibilities,
                    'requirements' => $postLowongan->requirements,
                    'education' => $postLowongan->education,
                    'experience' => $postLowongan->experience,
                    'salary_range' => $postLowongan->salary_range,
                    'benefits' => $postLowongan->benefits,
                    'location' => $postLowongan->location,
                    'application_deadline' => $postLowongan->application_deadline,
                    'accessibility_features' => $postLowongan->accessibility_features,
                    'work_accommodations' => $postLowongan->work_accommodations,
                    'skills' => $postLowongan->skills,
                    'perusahaan_profile' => $postLowongan->perusahaanProfile,
                    'disabilitas' => $postLowongan->disabilitas,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat membuat lowongan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function show($id)
    {
        $postLowongan = PostLowongan::with(['perusahaanProfile', 'disabilitas'])
            ->where('perusahaan_profile_id', Auth::user()->perusahaanProfile->id)
            ->where('id', $id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $postLowongan,
        ]);
    }

    /**
     * Delete the specified resource in storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();

        // Pastikan perusahaan punya profil
        if (! $user->perusahaanProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Perusahaan belum melengkapi profil.',
            ], 403);
        }

        // Cari lowongan milik perusahaan yang sesuai ID
        $postLowongan = PostLowongan::where('id', $id)
            ->where('perusahaan_profile_id', $user->perusahaanProfile->id)
            ->first();

        if (! $postLowongan) {
            return response()->json([
                'success' => false,
                'message' => 'Lowongan tidak ditemukan atau bukan milik perusahaan ini.',
            ], 404);
        }

        // Hapus soft delete (jika model pakai SoftDeletes)
        $postLowongan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lowongan berhasil dihapus.',
        ]);
    }

    public function lihatPelamar($id)
    {
        $postLowongan = Lamaran::with([
            'user',
            'lowongan',
            'user.userProfile',
            'user.userProfile.disabilitas',
            'user.userProfile.lokasi',
            'user.userProfile.resume',
            'user.userProfile.resume.bahasa',
            'user.userProfile.resume.keterampilan',
            'user.userProfile.resume.pendidikan',
            'user.userProfile.resume.pencapaian',
            'user.userProfile.resume.pelatihan',
            'user.userProfile.resume.sertifikasi',
            'user.userProfile.resume.pengalamanKerja',
        ])
            ->where('lowongan_id', $id)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $postLowongan,
        ]);
    }

    public function updateStatus($id, Request $request)
    {
        try {
            $lamaran = Lamaran::find($id);
            if (! $lamaran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lamaran tidak ditemukan',
                ], 404);
            }

            // Rules dasar
            $rules = [
                'status'       => 'required|in:pending,reviewed,interview,accepted,rejected',
                'feedback'     => 'nullable|string|max:1000',
                'type'         => 'nullable|in:online,offline',
                'location'     => 'nullable|string|max:255',
                'link_meeting' => 'nullable|url|max:255',
            ];

            // Validasi khusus jika interview
            if ($request->input('status') === 'interview') {
                $rules = array_merge($rules, [
                    'type'         => 'required|in:online,offline',
                    'link_meeting' => 'required_if:type,online|nullable|url|max:255',
                    'location'     => 'required_if:type,offline|nullable|string|max:255',
                ]);
            }

            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak valid',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $newStatus = $request->input('status');
            $feedback  = $request->input('feedback');

            // Update status
            $lamaran->status = $newStatus;

            switch ($newStatus) {
                case 'reviewed':
                    $lamaran->reviewed_at = now();
                    break;

                case 'interview':
                    $lamaran->interview_at = now();
                    $lamaran->type = $request->input('type');

                    if ($lamaran->type === 'online') {
                        // Online: wajib link, kosongkan location
                        $lamaran->link_meeting = $request->input('link_meeting');
                        $lamaran->location     = null;
                    } else {
                        // Offline: wajib location, kosongkan link
                        $lamaran->location     = $request->input('location');
                        $lamaran->link_meeting = null;
                    }
                    break;

                case 'accepted':
                    $lamaran->accepted_at = now();
                    break;

                case 'rejected':
                    $lamaran->rejected_at = now();
                    if (empty($feedback)) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Feedback wajib diisi untuk penolakan lamaran',
                        ], 422);
                    }
                    $lamaran->feedback = $feedback;
                    break;

                case 'pending':
                default:
                    // Tidak ada timestamp tambahan
                    break;
            }

            $lamaran->save();

            return response()->json([
                'success' => true,
                'message' => 'Status lamaran berhasil diperbarui',
                'data'    => [
                    'id'           => $lamaran->id,
                    'status'       => $lamaran->status,
                    'feedback'     => $lamaran->feedback,
                    'type'         => $lamaran->type,
                    'location'     => $lamaran->location,     // <- diperbaiki (sebelumnya salah kirim feedback)
                    'link_meeting' => $lamaran->link_meeting,
                    'updated_at'   => $lamaran->updated_at,
                    'reviewed_at'  => $lamaran->reviewed_at,
                    'interview_at' => $lamaran->interview_at,
                    'accepted_at'  => $lamaran->accepted_at,
                    'rejected_at'  => $lamaran->rejected_at,
                ],
            ], 200);
        } catch (\Throwable $e) {
            // opsional: log error untuk debugging
            // \Log::error('Gagal update status lamaran', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui status lamaran',
            ], 500);
        }
    }

    public function updateStatusReviewed($id)
    {
        $lamaran = Lamaran::find($id);
        if (! $lamaran) {
            return response()->json(['success' => false, 'message' => 'Lamaran tidak ditemukan'], 404);
        }

        $lamaran->status = 'reviewed';
        $lamaran->reviewed_at = now();
        $lamaran->save();

        return response()->json(['success' => true, 'message' => 'Status lamaran diperbarui menjadi reviewed'], 200);
    }

    // public function updateStatusInterview($id)
    // {
    //     $lamaran = Lamaran::find($id);
    //     if (!$lamaran) {
    //         return response()->json(['success' => false, 'message' => 'Lamaran tidak ditemukan'], 404);
    //     }

    //     $lamaran->status = 'interview';
    //     $lamaran->reviewed_at = now();
    //     $lamaran->save();

    //     return response()->json(['success' => true, 'message' => 'Status lamaran diperbarui menjadi interview'], 200);
    // }

    // public function updateStatusAccepted($id)
    // {
    //     $lamaran = Lamaran::find($id);
    //     if (!$lamaran) {
    //         return response()->json(['success' => false, 'message' => 'Lamaran tidak ditemukan'], 404);
    //     }

    //     $lamaran->status = 'accepted';
    //     $lamaran->accepted_at = now();
    //     $lamaran->save();

    //     return response()->json(['success' => true, 'message' => 'Status lamaran diperbarui menjadi accepted'], 200);
    // }

    // public function updateStatusRejected($id)
    // {
    //     $lamaran = Lamaran::find($id);
    //     if (!$lamaran) {
    //         return response()->json(['success' => false, 'message' => 'Lamaran tidak ditemukan'], 404);
    //     }

    //     $lamaran->status = 'rejected';
    //     $lamaran->rejected_at = now();
    //     $lamaran->save();

    //     return response()->json(['success' => true, 'message' => 'Status lamaran diperbarui menjadi rejected'], 200);
    // }
}
