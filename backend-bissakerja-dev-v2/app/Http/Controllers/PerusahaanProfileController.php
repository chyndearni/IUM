<?php

namespace App\Http\Controllers;

use App\Models\PerusahaanProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PerusahaanProfileController extends Controller
{

    public function showPerusahaanProfileForUser($id)
    {
        $profile = PerusahaanProfile::with(['province', 'regency', 'user'])
            ->where('id', $id)
            ->first();

        if (! $profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile perusahaan tidak ditemukan',
            ], 404);
        }

        // Add full URL for logo and bukti_wajib_lapor
        if ($profile->logo) {
            $profile->logo_url = Storage::disk('public')->url($profile->logo);
        }

        if ($profile->bukti_wajib_lapor) {
            $profile->bukti_wajib_lapor_url = Storage::disk('public')->url($profile->bukti_wajib_lapor);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile perusahaan berhasil diambil',
            'data' => $profile,
        ], 200);
    }


    /**
     * Menampilkan profile perusahaan berdasarkan user yang login
     */
    public function showPerusahaanProfile(): JsonResponse
    {
        try {
            $userId = Auth::user()->id;

            $profile = PerusahaanProfile::with(['province', 'regency', 'user'])
                ->where('user_id', $userId)
                ->first();

            if (! $profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profile perusahaan tidak ditemukan',
                ], 404);
            }

            // Add full URL for logo and bukti_wajib_lapor
            if ($profile->logo) {
                $profile->logo_url = Storage::disk('public')->url($profile->logo);
            }

            if ($profile->bukti_wajib_lapor) {
                $profile->bukti_wajib_lapor_url = Storage::disk('public')->url($profile->bukti_wajib_lapor);
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile perusahaan berhasil diambil',
                'data' => $profile,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil profile perusahaan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Membuat atau memperbarui profile perusahaan
     */
    public function createOrUpdatePerusahaanProfile(Request $request): JsonResponse
    {
        try {
            $userId = Auth::id();

            // Log request untuk debugging

            // Validasi input
            $validator = Validator::make($request->all(), [
                // Informasi Dasar
                'logo' => 'nullable|string', // base64 string
                'nama_perusahaan' => 'nullable|string|max:255',
                'industri' => 'required|string|max:255',
                'tahun_berdiri' => 'nullable|string|max:4',
                'jumlah_karyawan' => 'nullable|string|max:255',
                'province_id' => 'required|string|size:2|exists:provinces,id',
                'regencie_id' => 'required|string|size:4|exists:regencies,id',
                'deskripsi' => 'required|string',

                // Informasi Kontak
                'no_telp' => 'nullable|string|max:20',
                'link_website' => 'nullable|url|max:255',
                'alamat_lengkap' => 'required',

                // Informasi Visi dan Misi
                'visi' => 'required',
                'misi' => 'required',

                // Informasi Nilai-Nilai Perusahaan dan Sertifikat
                'nilai_nilai' => 'nullable|array',
                'nilai_nilai.*' => 'nullable|string',
                'sertifikat' => 'nullable|array',
                'sertifikat.*' => 'nullable|string',

                // Dokumen Wajib
                'bukti_wajib_lapor' => 'nullable|string', // base64 string
                'nib' => 'required|string|max:255',

                // Informasi Media Sosial
                'linkedin' => 'nullable|string|max:255',
                'instagram' => 'nullable|string|max:255',
                'facebook' => 'nullable|string|max:255',
                'twitter' => 'nullable|string|max:255',
                'youtube' => 'nullable|string|max:255',
                'tiktok' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            DB::beginTransaction();

            // Cek apakah profile sudah ada
            $profile = PerusahaanProfile::where('user_id', $userId)->first();
            $isUpdate = $profile !== null;

            // Validasi nib unique kecuali untuk update profile yang sama
            if (! $isUpdate || ($isUpdate && $profile->nib !== $request->nib)) {
                $nibExists = PerusahaanProfile::where('nib', $request->nib)
                    ->where('user_id', '!=', $userId)
                    ->exists();

                if ($nibExists) {
                    return response()->json([
                        'success' => false,
                        'message' => 'nib sudah digunakan oleh perusahaan lain',
                    ], 422);
                }
            }

            // Siapkan data untuk disimpan
            $data = [
                'nama_perusahaan' => $request->nama_perusahaan,
                'industri' => $request->industri,
                'tahun_berdiri' => $request->tahun_berdiri,
                'jumlah_karyawan' => $request->jumlah_karyawan,
                'province_id' => $request->province_id,
                'regencie_id' => $request->regencie_id,
                'deskripsi' => $request->deskripsi,
                'no_telp' => $request->no_telp,
                'link_website' => $request->link_website,
                'alamat_lengkap' => $request->alamat_lengkap,
                'visi' => $request->visi,
                'misi' => $request->misi,
                'nib' => $request->nib,
                'linkedin' => $request->linkedin,
                'instagram' => $request->instagram,
                'facebook' => $request->facebook,
                'twitter' => $request->twitter,
                'youtube' => $request->youtube,
                'tiktok' => $request->tiktok,
                // User ID dari yang login
                'user_id' => $userId,
            ];

            // Handle nilai_nilai array
            if ($request->has('nilai_nilai') && is_array($request->nilai_nilai)) {
                $filteredNilaiNilai = array_filter($request->nilai_nilai, function ($value) {
                    return ! empty(trim($value));
                });
                $data['nilai_nilai'] = ! empty($filteredNilaiNilai) ? json_encode(array_values($filteredNilaiNilai)) : null;
            } else {
                $data['nilai_nilai'] = null;
            }

            // Handle sertifikat array
            if ($request->has('sertifikat') && is_array($request->sertifikat)) {
                $filteredSertifikat = array_filter($request->sertifikat, function ($value) {
                    return ! empty(trim($value));
                });
                $data['sertifikat'] = ! empty($filteredSertifikat) ? json_encode(array_values($filteredSertifikat)) : null;
            } else {
                $data['sertifikat'] = null;
            }

            // Handle upload logo (base64)
            if ($request->filled('logo') && $this->isBase64($request->logo)) {
                try {
                    // Hapus logo lama jika update
                    if ($isUpdate && $profile->logo && Storage::disk('public')->exists($profile->logo)) {
                        Storage::disk('public')->delete($profile->logo);
                    }

                    $logoPath = $this->uploadBase64File($request->logo, 'logos');
                    $data['logo'] = $logoPath;
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Gagal mengupload logo: ' . $e->getMessage(),
                    ], 500);
                }
            } elseif (! $isUpdate && ! $request->filled('logo')) {
                // Jika create dan tidak ada logo, set required
                return response()->json([
                    'success' => false,
                    'message' => 'Logo perusahaan wajib diupload',
                    'errors' => ['logo' => ['Logo perusahaan wajib diupload']],
                ], 422);
            }

            // Handle upload bukti wajib lapor (base64)
            if ($request->filled('bukti_wajib_lapor') && $this->isBase64($request->bukti_wajib_lapor)) {
                try {
                    // Hapus bukti lama jika update
                    if ($isUpdate && $profile->bukti_wajib_lapor && Storage::disk('public')->exists($profile->bukti_wajib_lapor)) {
                        Storage::disk('public')->delete($profile->bukti_wajib_lapor);
                    }

                    $buktiPath = $this->uploadBase64File($request->bukti_wajib_lapor, 'bukti-wajib-lapor');
                    $data['bukti_wajib_lapor'] = $buktiPath;
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Gagal mengupload bukti wajib lapor: ' . $e->getMessage(),
                    ], 500);
                }
            } elseif (! $isUpdate && ! $request->filled('bukti_wajib_lapor')) {
                // Jika create dan tidak ada bukti, set required
                return response()->json([
                    'success' => false,
                    'message' => 'Bukti wajib lapor wajib diupload',
                    'errors' => ['bukti_wajib_lapor' => ['Bukti wajib lapor wajib diupload']],
                ], 422);
            }

            // Reset status verifikasi jika ada perubahan data penting
            if ($isUpdate) {
                $importantFields = ['nama_perusahaan', 'nib', 'industri', 'alamat_lengkap'];
                $hasImportantChanges = false;

                foreach ($importantFields as $field) {
                    if ($profile->$field !== $request->$field) {
                        $hasImportantChanges = true;
                        break;
                    }
                }

                if ($hasImportantChanges || $request->filled('bukti_wajib_lapor')) {
                    $data['status_verifikasi'] = 'proses';
                }
            } else {
                $data['status_verifikasi'] = 'proses';
            }

            // Simpan atau update data
            if ($isUpdate) {
                $profile->update($data);
                $message = 'Profile perusahaan berhasil diperbarui';
            } else {
                $profile = PerusahaanProfile::create($data);
                $message = 'Profile perusahaan berhasil dibuat';
            }

            DB::commit();

            // Load relasi untuk response
            $profile->load(['province', 'regency', 'user']);

            // Add full URL for response
            if ($profile->logo) {
                $profile->logo_url = Storage::disk('public')->url($profile->logo);
            }

            if ($profile->bukti_wajib_lapor) {
                $profile->bukti_wajib_lapor_url = Storage::disk('public')->url($profile->bukti_wajib_lapor);
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => $profile,
            ], $isUpdate ? 200 : 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan profile perusahaan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Menghapus profile perusahaan
     */
    public function deletePerusahaanProfile(): JsonResponse
    {
        try {
            $userId = Auth::id();

            $profile = PerusahaanProfile::where('user_id', $userId)->first();

            if (! $profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profile perusahaan tidak ditemukan',
                ], 404);
            }

            DB::beginTransaction();

            // Hapus file logo jika ada
            if ($profile->logo && Storage::disk('public')->exists($profile->logo)) {
                Storage::disk('public')->delete($profile->logo);
            }

            // Hapus file bukti wajib lapor jika ada
            if ($profile->bukti_wajib_lapor && Storage::disk('public')->exists($profile->bukti_wajib_lapor)) {
                Storage::disk('public')->delete($profile->bukti_wajib_lapor);
            }

            // Soft delete profile
            $profile->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Profile perusahaan berhasil dihapus',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menghapus profile perusahaan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper function to check if string is base64
     */
    private function isBase64($string): bool
    {
        return (bool) preg_match('/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9\-\+]+);base64,/', $string);
    }

    /**
     * Helper function to upload base64 file
     */
    private function uploadBase64File($base64String, $folder): string
    {
        // Extract the mime type and data
        $matches = [];
        if (! preg_match('/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9\-\+]+);base64,(.+)$/', $base64String, $matches)) {
            throw new \Exception('Invalid base64 format');
        }

        $mimeType = $matches[1];
        $data = base64_decode($matches[2]);

        if ($data === false) {
            throw new \Exception('Failed to decode base64 data');
        }

        // Get file extension from mime type
        $extension = $this->getExtensionFromMimeType($mimeType);

        // Generate unique filename
        $filename = Str::uuid() . '.' . $extension;
        $path = $folder . '/' . $filename;

        // Store file
        if (! Storage::disk('public')->put($path, $data)) {
            throw new \Exception('Failed to store file');
        }

        return $path;
    }

    /**
     * Helper function to get file extension from mime type
     */
    private function getExtensionFromMimeType($mimeType): string
    {
        $extensions = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/jpg' => 'jpg',
            'application/pdf' => 'pdf',
            'application/msword' => 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
        ];

        return $extensions[$mimeType] ?? 'bin';
    }
}
