<?php

namespace App\Http\Controllers;

use App\Enum\RoleEnum;
use App\Models\AdminProfile;
use App\Models\PerusahaanProfile;
use App\Models\Regency;
use App\Models\User;
use App\Models\UserProfile;
use App\Trait\ApiResponse;
use App\Trait\RoleCheck;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AccountManagementController extends Controller
{
    use ApiResponse, RoleCheck;

    // ========================= For Super Admin =========================
    public function getRegenciesByAdminRole()
    {
        $user = Auth::user();

        try {
            if (!$user->adminProfile) {
                return $this->errorResponse('Admin profile tidak ditemukan.', 404);
            }
            
            $provinceId = $user->adminProfile->province_id;

            if (! $provinceId) {
                return $this->errorResponse("Parameter 'province_id' diperlukan.", 400);
            }
            $regencies = Regency::select('id', 'name', 'province_id')
                ->where('province_id', $provinceId)
                ->get();

            if ($regencies->isEmpty()) {
                return $this->errorResponse('Tidak ada data kabupaten/kota untuk provinsi ini.', 404);
            }

            return $this->successResponse($regencies);
        } catch (\Throwable $e) {
            return $this->errorResponse('Terjadi kesalahan saat mengambil data kabupaten/kota.', 500);
        }
    }

    public function getAdminRoleByLocation()
    {
        $user = Auth::user();

        try {
            if (!$user->adminProfile) {
                return $this->errorResponse('Admin profile tidak ditemukan.', 404);
            }

            $query = AdminProfile::with([
                'user',
                'province',
                'regencies',
            ])->where('province_id', $user->adminProfile->province_id)
                ->where('user_id', '!=', $user->id)
                ->get();

            return $this->successResponse($query);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Akun disnaker daerah tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    public function createAdminRoleByLocation(Request $request)
    {
        $user = Auth::user();

        try {
            DB::beginTransaction();

            $validate = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
                'regencie_id' => 'required|exists:regencies,id',
                'status' => 'nullable|in:active,nonactive',
            ]);

            $newUser = User::create([
                'name' => $validate['name'],
                'email' => $validate['email'],
                'password' => Hash::make($validate['password']),
            ]);

            // Set default avatar
            $newUser->avatar = 'https://ui-avatars.com/api/?name='.urlencode($newUser->name);
            $newUser->save();

            $newUser->assignRole(RoleEnum::ADMIN->value);

            if (!$user->adminProfile) {
                DB::rollBack();
                return $this->errorResponse('Admin profile tidak ditemukan.', 404);
            }

            AdminProfile::create([
                'user_id' => $newUser->id,
                'province_id' => $user->adminProfile->province_id,
                'regencie_id' => $validate['regencie_id'],
                'status' => $validate['status'],
            ]);

            DB::commit();

            return $this->successResponse('Akun admin berhasil dibuat.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    public function deleteAdminRoleByLocation($id)
    {
        try {
            DB::beginTransaction();

            $adminProfile = AdminProfile::withTrashed()
                ->with(['user' => function ($q) {
                    $q->withTrashed();
                }])
                ->findOrFail($id);

            // Hard delete user terkait (jika ada)
            if ($adminProfile->user) {
                $adminProfile->user->forceDelete();
            }

            // Hard delete admin profile
            $adminProfile->forceDelete();

            DB::commit();

            return $this->successResponse('Akun admin berhasil dihapus permanen.');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return $this->errorResponse('Akun admin tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            DB::rollBack();

            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    public function restoreAdminRoleByLocation($id)
    {
        try {
            DB::beginTransaction();

            $adminProfile = AdminProfile::withTrashed()->with(['user' => function ($q) {
                $q->withTrashed();
            }])->findOrFail($id);

            // Restore admin profile
            $adminProfile->restore();

            // Restore user terkait
            if ($adminProfile->user) {
                $adminProfile->user->restore();
            }

            DB::commit();

            return $this->successResponse('Akun admin berhasil direstore.');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return $this->errorResponse('Akun admin tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            DB::rollBack();

            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    public function updateAdminRoleByLocation(Request $request)
    {
        try {
            DB::beginTransaction();

            $validate = $request->validate([
                'id' => 'required|exists:admin_profiles,id',
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'password' => 'nullable|string|min:8',
                'regencie_id' => 'required|exists:regencies,id',
                'status' => 'nullable|in:active,nonactive',
            ]);

            $adminProfile = AdminProfile::findOrFail($validate['id']);
            $user = $adminProfile->user;

            // Update user data
            $user->name = $validate['name'];
            $user->email = $validate['email'];

            if (! empty($validate['password'])) {
                $user->password = Hash::make($validate['password']);
            }

            $user->save();

            // Update admin profile data
            $adminProfile->regencie_id = $validate['regencie_id'];
            $adminProfile->status = $validate['status'] ?? null;
            $adminProfile->save();

            DB::commit();

            return $this->successResponse('Akun admin berhasil diupdate.');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return $this->errorResponse('Akun admin tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            DB::rollBack();

            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    // ========================= For Super Admin and Admin =========================

    // MANAGEMENT PERUSAHAAN PROFILE
    public function getCompanyByLocation()
    {
        $user = Auth::user();

        try {
            $query = collect([]);
            
            if (!$user->adminProfile) {
                return $this->errorResponse('Admin profile tidak ditemukan.', 404);
            }

            if ($user->hasRole(RoleEnum::SUPER_ADMIN->value)) {
                $query = PerusahaanProfile::with(['user', 'province', 'regency'])
                    ->where('province_id', $user->adminProfile->province_id)
                    ->get();
            } elseif ($user->hasRole(RoleEnum::ADMIN->value)) {
                $query = PerusahaanProfile::with(['user', 'province', 'regency'])
                    ->where('province_id', $user->adminProfile->province_id)
                    ->where('regencie_id', $user->adminProfile->regencie_id)
                    ->get();
            }

            return $this->successResponse($query);
        } catch (\Throwable $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    public function showCompanyByLocation($id)
    {
        try {
            $companyProfile = PerusahaanProfile::with(['user', 'province', 'regency'])
                ->findOrFail($id);

            return $this->successResponse($companyProfile);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Akun perusahaan tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    public function updateCompanyByLocation(Request $request)
    {
        try {
            DB::beginTransaction();

            $validate = $request->validate([
                'id' => 'required|exists:admin_profiles,id',
                'status' => 'in:belum,proses,terverifikasi',
            ]);

            $companyProfile = PerusahaanProfile::findOrFail($validate['id']);

            // Update status perusahaan profile data
            $companyProfile->status_verifikasi = $validate['status'];
            $companyProfile->save();

            DB::commit();

            return $this->successResponse('Akun perusahaan berhasil diupdate.');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return $this->errorResponse('Akun perusahaan tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            DB::rollBack();

            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    public function deleteCompanyByLocation($id)
    {
        try {
            DB::beginTransaction();

            // Ambil data perusahaan dan user terkait
            $companyProfile = PerusahaanProfile::findOrFail($id);

            // Hapus file logo jika ada
            if ($companyProfile->logo && Storage::exists($companyProfile->logo)) {
                Storage::delete($companyProfile->logo);
            }

            // Hapus company profile
            $companyProfile->delete();

            DB::commit();

            return $this->successResponse('Akun perusahaan dan logonya berhasil dihapus permanen.');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return $this->errorResponse('Akun perusahaan tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            DB::rollBack();

            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    // MANAGEMENT USER PROFILE
    public function getUserProfileByLocation()
    {
        $user = Auth::user();

        try {
            $query = collect([]);
            
            if (!$user->adminProfile) {
                return $this->errorResponse('Admin profile tidak ditemukan.', 404);
            }

            if ($user->hasRole(RoleEnum::SUPER_ADMIN->value)) {
                $query = UserProfile::with([
                    'user',
                    'lokasi',
                    'disabilitas',
                    'resume',
                    'resume.bahasa',
                    'resume.keterampilan',
                    'resume.pendidikan',
                    'resume.pencapaian',
                    'resume.pelatihan',
                    'resume.sertifikasi',
                    'resume.pengalamanKerja',
                ])
                    ->whereHas('lokasi', function ($q) use ($user) {
                        $q->where('province_ktp_id', $user->adminProfile->province_id);
                    })
                    ->get();
            } elseif ($user->hasRole(RoleEnum::ADMIN->value)) {
                $query = UserProfile::with([
                    'user',
                    'lokasi',
                    'disabilitas',
                    'resume',
                    'resume.bahasa',
                    'resume.keterampilan',
                    'resume.pendidikan',
                    'resume.pencapaian',
                    'resume.pelatihan',
                    'resume.sertifikasi',
                    'resume.pengalamanKerja',
                ])
                    ->whereHas('lokasi', function ($q) use ($user) {
                        $q->where('regencie_ktp_id', $user->adminProfile->regencie_id);
                    })
                    ->get();
            }

            return $this->successResponse($query);
        } catch (\Throwable $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    public function showUserProfileByLocation($id)
    {
        try {
            $userProfile = UserProfile::with([
                'user',
                'lokasi',
                'disabilitas',
                'resume',
                'resume.bahasa',
                'resume.keterampilan',
                'resume.pendidikan',
                'resume.pencapaian',
                'resume.pelatihan',
                'resume.sertifikasi',
                'resume.pengalamanKerja',
            ])->findOrFail($id);

            return $this->successResponse($userProfile);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Profil pengguna tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

}
