<?php

namespace App\Http\Controllers;

use App\Enum\EducationLevel;
use App\Enum\LanguageLevel;
use App\Models\Bahasa;
use App\Models\Keterampilan;
use App\Models\LokasiKtp;
use App\Models\Pelatihan;
use App\Models\Pencapaian;
use App\Models\Pendidikan;
use App\Models\User;
use App\Models\UserProfile;
use App\Trait\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Enum;

class ResumeController extends Controller
{
    use ApiResponse;

    /**
     * Create resume
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createResume(Request $request)
    {
        $validatedData = $request->validate([
            'ringkasan_pribadi' => 'required|string',
        ]);

        $userProfile = Auth::user()->userProfile;

        if (! $userProfile) {
            return response()->json(['message' => 'User profile not found'], 404);
        }

        try {
            $resume = $userProfile->resume()->create($validatedData);

            return response()->json([
                'message' => 'Resume created successfully',
                'data' => $resume,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating resume',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getResume(Request $request, $id)
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

    /**
     * Method membuat bahasa baru
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createBahasa(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:100',
                'tingkat' => ['required', new Enum(LanguageLevel::class)],
            ]);

            $resume = Auth::user()->userProfile->resume;
            if (! $resume) {
                return response()->json(['message' => 'Resume not found'], 404);
            }

            $bahasa = $resume->bahasa()->create($data);

            return $this->successResponse($bahasa);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error creating bahasa',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getBahasa()
    {
        try {
            $data = Auth::user()->userProfile->resume->bahasa()->get();

            return $this->successResponse($data);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function updateBahasa(Request $request)
    {
        try {
            $data = $request->validate([
                'bahasa_id' => 'required|integer|exists:bahasa,id',
                'name' => 'required|string|max:100',
                'tingkat' => ['required', new Enum(LanguageLevel::class)],
            ]);

            $bahasa = Bahasa::find($data['bahasa_id']);
            if (! $bahasa) {
                return $this->errorResponse('Bahasa not found', 404);
            }

            $bahasa->update($data);

            return $this->successResponse($bahasa);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function deleteBahasa(Request $request)
    {
        try {
            $data = $request->validate([
                'bahasa_id' => 'required|integer|exists:bahasa,id',
            ]);

            $bahasa = Bahasa::find($data['bahasa_id']);

            if (! $bahasa) {
                return $this->errorResponse('Bahasa not found', 404);
            }
            $bahasa->delete();

            return $this->successResponse('Bahasa deleted successfully');
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function createKeterampilan(Request $request)
    {
        try {
            $data = $request->validate([
                'nama_keterampilan' => 'required|array',
                'nama_keterampilan.*' => 'required|string',
            ]);

            $resume = Auth::user()->userProfile->resume;
            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            $keterampilan = $resume->keterampilan()->create([
                'nama_keterampilan' => $data['nama_keterampilan'],
            ]);

            return $this->successResponse($keterampilan);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function getKeterampilan()
    {
        try {
            $data = Auth::user()->userProfile->resume->keterampilan()->get();

            return $this->successResponse($data);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function updateKeterampilan(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'keterampilan_id' => 'required|integer|exists:keterampilan,id',
                'name' => 'required|string|max:100',
            ]);

            $keterampilan = Keterampilan::find($validatedData['keterampilan_id']);

            if (! $keterampilan) {
                return $this->errorResponse('Keterampilan not found', 404);
            }

            $keterampilan->update(['name' => $validatedData['name']]);

            return $this->successResponse($keterampilan);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function deleteKeterampilan(Request $request)
    {
        try {
            $data = $request->validate([
                'keterampilan_id' => 'required|integer|exists:keterampilan,id',
            ]);

            $data = Keterampilan::find($data['keterampilan_id']);
            if (! $data) {
                return $this->errorResponse('Keterampilan not found', 404);
            }
            $data->delete();

            return $this->successResponse('Keterampilan deleted successfully');
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function createPendidikan(Request $request)
    {
        try {
            $data = $request->validate([
                'tingkat' => ['required', 'in:'.implode(',', array_map(fn ($e) => $e->value, EducationLevel::cases()))],
                'bidang_studi' => 'nullable|string',
                'nilai' => 'nullable|string|max:10',
                'tanggal_mulai' => 'required|date',
                'tanggal_akhir' => 'required|date|after_or_equal:tanggal_mulai',
                'lokasi' => 'nullable|string|max:255',
                'deskripsi' => 'nullable|string',
                'ijazah_base64' => 'required|string',
                'ijazah_info.name' => 'required|string',
            ]);

            $resume = Auth::user()->userProfile->resume;

            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            // Hapus semua prefix data URI (apapun mime-nya)
            if (preg_match('/^data:(.*);base64,/', $data['ijazah_base64'])) {
                $data['ijazah_base64'] = substr($data['ijazah_base64'], strpos($data['ijazah_base64'], ',') + 1);
            }

            $decodedFile = base64_decode($data['ijazah_base64']);

            if ($decodedFile === false) {
                return response()->json(['message' => 'File ijazah tidak valid.'], 422);
            }

            $originalName = str_replace(' ', '_', $data['ijazah_info']['name']);
            $filename = Str::random(30).'-'.$originalName;
            $path = 'ijazah/'.$filename;

            Storage::disk('public')->put($path, $decodedFile);

            $pendidikan = $resume->pendidikan()->create([
                'tingkat' => $data['tingkat'],
                'bidang_studi' => $data['bidang_studi'] ?? null,
                'nilai' => $data['nilai'] ?? null,
                'tanggal_mulai' => $data['tanggal_mulai'],
                'tanggal_akhir' => $data['tanggal_akhir'],
                'lokasi' => $data['lokasi'] ?? null,
                'deskripsi' => $data['deskripsi'] ?? null,
                'ijazah' => $path,
            ]);

            return response()->json([
                'message' => 'Data pendidikan berhasil ditambahkan',
                'data' => $pendidikan,
                'file_url' => asset('storage/'.$path),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan data pendidikan.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getPendidikan()
    {
        try {
            $data = Auth::user()->userProfile->resume->pendidikan()->get();

            return $this->successResponse($data);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function updatePendidikan(Request $request)
    {
        try {
            $data = $request->validate([
                'pendidikan_id' => 'required|integer|exists:pendidikan,id',
                'tingkat' => 'nullable|string|max:100',
                'bidang_studi' => 'nullable|string|max:100',
                'nilai' => 'nullable|string|max:10',
                'tanggal_mulai' => 'nullable|date',
                'tanggal_akhir' => 'nullable|date|after_or_equal:tanggal_mulai',
                'lokasi' => 'nullable|string|max:255',
                'deskripsi' => 'nullable|string',
                'ijazah' => 'nullable|file|mimes:pdf|max:3072',
            ]);

            $resume = Auth::user()->userProfile->resume;
            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            $pendidikan = Pendidikan::find($data['pendidikan_id']);

            // Pastikan pendidikan ditemukan
            if (! $pendidikan) {
                return response()->json(['message' => 'Data pendidikan tidak ditemukan.'], 404);
            }

            // Pastikan pendidikan milik user yang sedang login
            if ($pendidikan->resume_id !== $resume->id) {
                return response()->json(['message' => 'Anda tidak memiliki akses untuk mengupdate data pendidikan ini.'], 403);
            }

            // Siapkan data update
            $updateData = [
                'tingkat' => $data['tingkat'] ?? $pendidikan->tingkat,
                'bidang_studi' => $data['bidang_studi'] ?? $pendidikan->bidang_studi,
                'nilai' => $data['nilai'] ?? $pendidikan->nilai,
                'tanggal_mulai' => $data['tanggal_mulai'] ?? $pendidikan->tanggal_mulai,
                'tanggal_akhir' => $data['tanggal_akhir'] ?? $pendidikan->tanggal_akhir,
                'lokasi' => $data['lokasi'] ?? $pendidikan->lokasi,
                'deskripsi' => $data['deskripsi'] ?? $pendidikan->deskripsi,
            ];

            // Handle file upload jika ada
            if ($request->hasFile('ijazah')) {
                $path = 'ijazah/'.Str::random(30);
                $updateData['ijazah'] = $request->file('ijazah')->store($path);
            }

            // Update data
            $pendidikan->update($updateData);

            // Refresh model untuk mendapatkan data terbaru
            $pendidikan->refresh();

            return $this->successResponse($pendidikan);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function deletePendidikan(Request $request)
    {
        try {
            $data = $request->validate([
                'pendidikan_id' => 'required|integer|exists:pendidikan,id',
            ]);

            $data = Pendidikan::find($data['pendidikan_id']);

            if (! $data) {
                return $this->errorResponse('Pendidikan not found', 404);
            }

            $data->delete();

            return $this->successResponse('Data pendidikan berhasil dihapus');
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function createPencapaian(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'penyelenggara' => 'required|string',
                'tanggal_pencapaian' => 'required|date',
                'dokumen_base64' => 'required|string',
                'dokumen_info.name' => 'required|string',
            ]);

            $resume = Auth::user()->userProfile->resume;
            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            $filePath = null;

            if ($request->filled('dokumen_base64')) {
                $base64Data = $data['dokumen_base64'];

                // Hapus prefix data URI jika ada
                if (preg_match('/^data:(.*);base64,/', $base64Data)) {
                    $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
                }

                $decodedFile = base64_decode($base64Data);
                if ($decodedFile === false) {
                    return response()->json(['message' => 'File dokumen tidak valid.'], 422);
                }

                $originalName = str_replace(' ', '_', $data['dokumen_info']['name']);
                $randomDir = Str::random(30);
                $filePath = "pencapaian/{$randomDir}-{$originalName}";

                Storage::disk('public')->put($filePath, $decodedFile);
            }

            $pencapaian = $resume->pencapaian()->create([
                'name' => $data['name'],
                'penyelenggara' => $data['penyelenggara'],
                'tanggal_pencapaian' => $data['tanggal_pencapaian'],
                'dokumen' => $filePath,
            ]);

            return $this->successResponse($pencapaian);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function getPencapaian()
    {
        try {
            $data = Auth::user()->userProfile->resume->pencapaian()->get();

            return $this->successResponse($data);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function updatePencapaian(Request $request)
    {
        try {
            $data = $request->validate([
                'pencapaian_id' => 'required|integer|exists:pencapaian,id',
                'name' => 'nullable|string|max:150',
                'penyelenggara' => 'nullable|string|max:150',
                'tanggal_pencapaian' => 'nullable|date',
                'dokumen' => 'nullable|file|mimes:pdf|max:3072',
            ]);

            $resume = Auth::user()->userProfile->resume;

            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            $pencapaian = Pencapaian::find($data['pencapaian_id']);

            if (! $pencapaian) {
                return response()->json(['message' => 'Pencapaian tidak ditemukan.'], 404);
            }

            if ($pencapaian->resume_id !== $resume->id) {
                return response()->json(['message' => 'Anda tidak memiliki akses untuk mengupdate pencapaian ini.'], 403);
            }

            $updateData = [
                'name' => $data['name'] ?? $pencapaian->name,
                'penyelenggara' => $data['penyelenggara'] ?? $pencapaian->penyelenggara,
                'tanggal_pencapaian' => $data['tanggal_pencapaian'] ?? $pencapaian->tanggal_pencapaian,
            ];

            if ($request->hasFile('dokumen')) {
                $path = 'pencapaian/'.Str::random(30);
                $updateData['dokumen'] = $request->file('dokumen')->store($path);
            }

            $pencapaian->update($updateData);

            $pencapaian->refresh();

            return $this->successResponse($pencapaian);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function deletePencapaian(Request $request)
    {
        try {
            $data = $request->validate([
                'pencapaian_id' => 'required|integer|exists:pencapaian,id',
            ]);

            $data = Pencapaian::find($data['pencapaian_id']);
            if (! $data) {
                return $this->errorResponse('Pencapaian not found', 404);
            }
            $data->delete();

            return $this->successResponse('Data pencapaian berhasil dihapus');
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function createPelatihan(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'penyelenggara' => 'required|string',
                'tanggal_mulai' => 'nullable|date',
                'tanggal_akhir' => 'nullable|date|after_or_equal:tanggal_mulai',
                'deskripsi' => 'nullable|string',
                'sertifikat_base64' => 'nullable|string',
                'sertifikat_info.name' => 'required_with:sertifikat_base64|string',
            ]);

            $resume = Auth::user()->userProfile->resume;
            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            $filePath = null;

            if ($request->filled('sertifikat_base64')) {
                $base64Data = $data['sertifikat_base64'];

                // Deteksi dan pisahkan prefix MIME
                if (preg_match('/^data:(.*);base64,/', $base64Data, $match)) {
                    $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
                }

                $decodedFile = base64_decode($base64Data);
                if ($decodedFile === false) {
                    return response()->json(['message' => 'File sertifikat tidak valid.'], 422);
                }

                $originalName = str_replace(' ', '_', $data['sertifikat_info']['name']);
                $filePath = 'pelatihan/'.$originalName;

                Storage::disk('public')->put($filePath, $decodedFile);
            }

            $pelatihan = $resume->pelatihan()->create([
                'name' => $data['name'],
                'penyelenggara' => $data['penyelenggara'],
                'tanggal_mulai' => $data['tanggal_mulai'],
                'tanggal_akhir' => $data['tanggal_akhir'],
                'deskripsi' => $data['deskripsi'],
                'sertifikat_file' => $filePath,
            ]);

            return $this->successResponse($pelatihan);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function getPelatihan()
    {
        try {
            $data = Auth::user()->userProfile->resume->pelatihan()->get();

            return $this->successResponse($data);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function updatePelatihan(Request $request)
    {
        try {
            $data = $request->validate([
                'pelatihan_id' => 'required|integer|exists:pelatihan,id',
                'name' => 'nullable|string',
                'penyelenggara' => 'nullable|string',
                'tanggal_mulai' => 'nullable|date',
                'tanggal_akhir' => 'nullable|date|after_or_equal:tanggal_mulai',
                'deskripsi' => 'nullable|string',
                'sertifikat_file' => 'nullable|file|mimes:pdf|max:3072',
            ]);

            $resume = Auth::user()->userProfile->resume;
            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            // Cari pelatihan berdasarkan ID
            $pelatihan = Pelatihan::find($data['pelatihan_id']);

            // Pastikan pelatihan ditemukan
            if (! $pelatihan) {
                return response()->json(['message' => 'Data pelatihan tidak ditemukan.'], 404);
            }

            // Pastikan pelatihan milik user yang sedang login
            if ($pelatihan->resume_id !== $resume->id) {
                return response()->json(['message' => 'Anda tidak memiliki akses untuk mengupdate data pelatihan ini.'], 403);
            }

            // Siapkan data update
            $updateData = [
                'name' => $data['name'] ?? $pelatihan->name,
                'penyelenggara' => $data['penyelenggara'] ?? $pelatihan->penyelenggara,
                'tanggal_mulai' => $data['tanggal_mulai'] ?? $pelatihan->tanggal_mulai,
                'tanggal_akhir' => $data['tanggal_akhir'] ?? $pelatihan->tanggal_akhir,
                'deskripsi' => $data['deskripsi'] ?? $pelatihan->deskripsi,
            ];

            // Handle file upload jika ada
            if ($request->hasFile('sertifikat_file')) {
                $path = 'pelatihan/'.Str::random(30);
                $updateData['sertifikat_file'] = $request->file('sertifikat_file')->store($path);
            }

            // Update data pelatihan
            $pelatihan->update($updateData);

            // Refresh model untuk mendapatkan data terbaru
            $pelatihan->refresh();

            return $this->successResponse($pelatihan);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function deletePelatihan(Request $request)
    {
        try {
            $data = $request->validate([
                'pelatihan_id' => 'required|integer|exists:pelatihan,id',
            ]);

            $data = Pelatihan::find($data['pelatihan_id']);

            if (! $data) {
                return $this->errorResponse('Pelatihan tidak ditemukan.', 404);
            }

            $data->delete();

            return $this->successResponse('Data pelatihan berhasil dihapus');
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function createSertfikasi(Request $request)
    {
        try {
            $data = $request->validate([
                'program' => 'required|string',
                'lembaga' => 'required|string',
                'nilai' => 'required|numeric|min:0|max:100',
                'tanggal_mulai' => 'nullable|date',
                'tanggal_akhir' => 'nullable|date|after_or_equal:tanggal_mulai',
                'deskripsi' => 'nullable|string',
                'sertifikat_base64' => 'nullable|string',
                'sertifikat_info.name' => 'required_with:sertifikat_base64|string',
            ]);

            $resume = Auth::user()->userProfile->resume;
            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            $filePath = null;

            // Jika file base64 dikirim, simpan ke storage
            if ($request->filled('sertifikat_base64')) {
                $base64Data = $data['sertifikat_base64'];

                // Hilangkan prefix base64
                if (preg_match('/^data:(.*);base64,/', $base64Data)) {
                    $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
                }

                $decodedFile = base64_decode($base64Data);
                if ($decodedFile === false) {
                    return response()->json(['message' => 'File sertifikat tidak valid.'], 422);
                }

                $originalName = str_replace(' ', '_', $data['sertifikat_info']['name']);
                $randomDir = Str::random(30);
                $filePath = "sertifikat/{$randomDir}-".$originalName;

                Storage::disk('public')->put($filePath, $decodedFile);
            }

            $sertifikat = $resume->sertifikasi()->create([
                'program' => $data['program'],
                'lembaga' => $data['lembaga'],
                'nilai' => $data['nilai'],
                'tanggal_mulai' => $data['tanggal_mulai'],
                'tanggal_akhir' => $data['tanggal_akhir'],
                'deskripsi' => $data['deskripsi'],
                'sertifikat_file' => $filePath,
            ]);

            return $this->successResponse($sertifikat);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function getSertfikasi()
    {
        try {
            $data = Auth::user()->userProfile->resume->sertifikasi()->get();

            return $this->successResponse($data);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function updateSertifikat(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'program' => 'nullable|string|max:150',
                'lembaga' => 'nullable|string|max:150',
                'nilai' => 'nullable|numeric|min:0|max:100',
                'tanggal_mulai' => 'nullable|date',
                'tanggal_akhir' => 'nullable|date|after_or_equal:tanggal_mulai',
                'deskripsi' => 'nullable|string',
                'sertifikat_file' => 'nullable|file|mimes:pdf|max:3072',
            ]);

            $resume = Auth::user()->userProfile->resume;

            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            // Find specific sertifikat by ID
            $sertifikat = $resume->sertifikasi()->find($id);

            if (! $sertifikat) {
                return response()->json(['message' => 'Sertifikat tidak ditemukan.'], 404);
            }

            // Handle file upload only if new file is provided
            if ($request->hasFile('sertifikat_file')) {
                // Delete old file if exists
                if ($sertifikat->sertifikat_file && Storage::exists($sertifikat->sertifikat_file)) {
                    Storage::delete($sertifikat->sertifikat_file);
                }

                $path = 'sertifikat/'.Str::random(30);
                $data['sertifikat_file'] = $request->file('sertifikat_file')->store($path);
            }

            // Remove null values to avoid overwriting existing data with null
            $data = array_filter($data, function ($value) {
                return $value !== null;
            });

            $sertifikat->update($data);

            return $this->successResponse($sertifikat);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function deleteSertifikat(Request $request)
    {
        try {
            $data = $request->validate([
                'sertifikat_id' => 'required|integer|exists:sertifikasi,id', // Fixed table name
            ]);

            $resume = Auth::user()->userProfile->resume;

            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            // Find sertifikat that belongs to user's resume
            $sertifikat = $resume->sertifikasi()->find($data['sertifikat_id']);

            if (! $sertifikat) {
                return $this->errorResponse('Sertifikasi tidak ditemukan.', 404);
            }

            // Delete file if exists
            if ($sertifikat->sertifikat_file && Storage::exists($sertifikat->sertifikat_file)) {
                Storage::delete($sertifikat->sertifikat_file);
            }

            $sertifikat->delete();

            return $this->successResponse('Data sertifikasi berhasil dihapus'); // Fixed message
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function createPengalamanKerja(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'nama_perusahaan' => 'required|string',
                'tipe_pekerjaan' => 'required|string',
                'lokasi' => 'required|string',
                'tanggal_mulai' => 'required|date',
                'tanggal_akhir' => 'nullable|date|after_or_equal:tanggal_mulai',
                'deskripsi' => 'nullable|string',
                'sertifikat_base64' => 'nullable|string',
                'sertifikat_info.name' => 'required_with:sertifikat_base64|string',
                'status' => 'required|in:0,1',
            ]);

            $resume = Auth::user()->userProfile->resume;

            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            $filePath = null;

            if ($request->filled('sertifikat_base64')) {
                if (preg_match('/^data:(.*);base64,/', $data['sertifikat_base64'])) {
                    $data['sertifikat_base64'] = substr($data['sertifikat_base64'], strpos($data['sertifikat_base64'], ',') + 1);
                }

                $decodedFile = base64_decode($data['sertifikat_base64']);

                if ($decodedFile === false) {
                    return response()->json(['message' => 'File sertifikat tidak valid.'], 422);
                }

                $originalName = str_replace(' ', '_', $data['sertifikat_info']['name']);
                $filename = Str::random(30).'-'.$originalName;
                $filePath = 'pengalaman_kerja/'.$filename;

                Storage::disk('public')->put($filePath, $decodedFile);
            }

            $pengalaman = $resume->pengalamanKerja()->create([
                'name' => $data['name'],
                'nama_perusahaan' => $data['nama_perusahaan'],
                'tipe_pekerjaan' => $data['tipe_pekerjaan'],
                'lokasi' => $data['lokasi'],
                'tanggal_mulai' => $data['tanggal_mulai'],
                'tanggal_akhir' => $data['tanggal_akhir'],
                'deskripsi' => $data['deskripsi'] ?? null,
                'sertifikat_file' => $filePath,
                'status' => $data['status'],
            ]);

            return $this->successResponse($pengalaman);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function getPengalamanKerja()
    {
        try {
            $resume = Auth::user()->userProfile->resume;
            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            $data = $resume->pengalamanKerja()->latest()->get();

            return $this->successResponse($data);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function updatePengalamanKerja(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:150',
                'nama_perusahaan' => 'required|string|max:150',
                'tipe_pekerjaan' => 'required|string|max:100',
                'lokasi' => 'required|string|max:150',
                'tanggal_mulai' => 'required|date',
                'tanggal_akhir' => 'nullable|date|after_or_equal:tanggal_mulai',
                'deskripsi' => 'nullable|string',
                'sertifikat_file' => 'nullable|file|mimes:pdf|max:3072',
                'status' => 'required|in:APPROVED,REJECTED,BOOKED',
            ]);

            $resume = Auth::user()->userProfile->resume;
            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            $pengalaman = $resume->pengalamanKerja()->findOrFail($id);

            if ($request->hasFile('sertifikat_file')) {
                $randomDir = Str::random(30);
                $file = $request->file('sertifikat_file');
                $filePath = $file->storeAs("pengalaman_kerja/{$randomDir}", $file->getClientOriginalName(), 'public');
                $pengalaman->sertifikat_file = $filePath;
            }

            $pengalaman->update([
                'name' => $data['name'],
                'nama_perusahaan' => $data['nama_perusahaan'],
                'tipe_pekerjaan' => $data['tipe_pekerjaan'],
                'lokasi' => $data['lokasi'],
                'tanggal_mulai' => $data['tanggal_mulai'],
                'tanggal_akhir' => $data['tanggal_akhir'],
                'deskripsi' => $data['deskripsi'] ?? null,
                'status' => $data['status'],
            ]);

            return $this->successResponse($pengalaman);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function deletePengalamanKerja($id)
    {
        try {
            $resume = Auth::user()->userProfile->resume;
            if (! $resume) {
                return response()->json(['message' => 'Resume tidak ditemukan.'], 404);
            }

            $pengalaman = $resume->pengalamanKerja()->findOrFail($id);
            $pengalaman->delete();

            return response()->json(['message' => 'Data pengalaman kerja berhasil dihapus.']);
        } catch (\Throwable $e) {
            return $this->errorResponse([$e->getMessage()]);
        }
    }

    public function createLokasi(Request $request)
    {
        try {
            $data = $request->validate([
                // Validasi untuk KTP
                'province_ktp_id' => 'required|string|size:2|exists:provinces,id',
                'regencie_ktp_id' => 'required|string|size:4|exists:regencies,id',
                'district_ktp_id' => 'required|string|size:7|exists:districts,id',
                'village_ktp_id' => 'required|string|size:10|exists:villages,id',
                'kode_pos_ktp' => 'required|string|digits:5',
                'alamat_lengkap_ktp' => 'required|string',

                // Validasi untuk Domisili
                'province_domisili_id' => 'required|string|size:2|exists:provinces,id',
                'regencie_domisili_id' => 'required|string|size:4|exists:regencies,id',
                'district_domisili_id' => 'required|string|size:7|exists:districts,id',
                'village_domisili_id' => 'required|string|size:10|exists:villages,id',
                'kode_pos_domisili' => 'required|string|digits:5',
                'alamat_lengkap_domisili' => 'required|string',
            ]);

            // Mendapatkan user profile
            $userProfile = Auth::user()->userProfile;
            if (! $userProfile) {
                return response()->json(['message' => 'User profile not found'], 404);
            }

            // Cek apakah sudah ada data lokasi untuk user ini
            $existingLokasi = $userProfile->lokasi;
            if ($existingLokasi) {
                // Jika sudah ada, update data yang ada
                $existingLokasi->update($data);
                $lokasi = $existingLokasi->fresh(); // Refresh data

                return response()->json([
                    'message' => 'Lokasi berhasil diupdate',
                    'data' => $lokasi,
                ], 200);
            } else {
                // Jika belum ada, buat data baru
                $data['user_profile_id'] = $userProfile->id;
                $lokasi = LokasiKtp::create($data);

                return response()->json([
                    'message' => 'Lokasi berhasil dibuat',
                    'data' => $lokasi,
                ], 201);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error creating/updating lokasi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteCV()
    {
        $userProfile = UserProfile::where('user_id', Auth::user()->id)->first();
        $userProfile->delete();

        return response()->json([
            'message' => 'CV berhasil dihapus',
        ], 201);
    }
}
