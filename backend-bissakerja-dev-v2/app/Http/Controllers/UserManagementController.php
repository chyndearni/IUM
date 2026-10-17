<?php

namespace App\Http\Controllers;

use App\Enum\RoleEnum;
use App\Http\Requests\UserManagement\CreateAccountKandidatRequest;
use App\Http\Requests\UserManagement\CreateAccountPerusahaanRequest;
use App\Http\Requests\UserManagement\UpdateAccountKandidatRequest;
use App\Http\Requests\UserManagement\UpdateAccountPerusahaanRequest;
use App\Models\User;
use App\Trait\ApiResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    use ApiResponse;

    /**
     * Method untuk membuat account perusahaan
     */
    public function createAccountPerusahaan(CreateAccountPerusahaanRequest $request): JsonResponse
    {
        try {
            $validate = $request->validated();

            $role = Role::where('name', $validate['role'])->firstOrFail();

            if ($role->name != RoleEnum::PERUSAHAAN->value) {
                return $this->errorResponse('Role tidak valid.', 422);
            }

            $user = User::create([
                'name' => $validate['name'],
                'email' => $validate['email'],
                'password' => Hash::make($validate['password']),
            ]);

            $user->assignRole(RoleEnum::PERUSAHAAN->value);

            return $this->successResponse('Akun perusahaan berhasil dibuat.');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Role tidak ditemukan.', 500);
        } catch (\Throwable $th) {
            return $this->errorResponse($th, 500);
        }
    }

    /**
     * Menampilkan daftar akun perusahaan dengan filter dinamis
     */
    public function getAccountPerusahaan(Request $request): JsonResponse
    {
        try {
            $query = User::role(RoleEnum::PERUSAHAAN->value)
                ->select(['id', 'name', 'email', 'avatar', 'created_at', 'updated_at'])
                ->with([
                    'roles:id,name',
                    'perusahaanProfile:id,nama_perusahaan,alamat,deskripsi,nib,province_id,regencie_id,user_id,industri_id',
                    'perusahaanProfile.province:id,name',
                    'perusahaanProfile.regencies:id,name',
                    'perusahaanProfile.industri:id,name',
                ]);

            // Filter berdasarkan nama perusahaan
            if ($request->has('nama_perusahaan')) {
                $query->whereHas('perusahaanProfile', function ($q) use ($request) {
                    $q->where('nama_perusahaan', 'like', '%'.$request->input('nama_perusahaan').'%');
                });
            }

            // Filter berdasarkan NIB
            if ($request->has('nib')) {
                $query->whereHas('perusahaanProfile', function ($q) use ($request) {
                    $q->where('nib', $request->input('nib'));
                });
            }

            // Filter berdasarkan Provinsi
            if ($request->has('province_id')) {
                $query->whereHas('perusahaanProfile.province', function ($q) use ($request) {
                    $q->where('id', $request->input('province_id'));
                });
            }

            // Filter berdasarkan Kabupaten/Kota
            if ($request->has('regencie_id')) {
                $query->whereHas('perusahaanProfile.regencies', function ($q) use ($request) {
                    $q->where('id', $request->input('regencie_id'));
                });
            }

            // Filter berdasarkan nama pengguna
            if ($request->has('name')) {
                $query->where('name', 'like', '%'.$request->input('name').'%');
            }

            $perPage = $request->input('per_page', 15);

            // Ambil hasil query dengan pagination
            $perusahaan = $query->paginate($perPage);

            return $this->paginateResponse($perusahaan);
        } catch (\Throwable $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    /**
     * delete account perusahaan
     */
    public function deleteAccountPerusahaan($id): JsonResponse
    {
        try {

            $user = User::where('id', $id)
                ->whereHas('roles', function ($query) {
                    $query->where('name', RoleEnum::PERUSAHAAN->value);
                })->firstOrFail();

            $user->delete();

            return $this->successResponse('Akun perusahaan berhasil dihapus.');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Akun Perusahaan tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            return $this->errorResponse('Terjadi kesalahan saat menghapus akun Perusahaan.', 500);
        }
    }

    /**
     * Method untuk update account perusahaan
     */
    public function updateAccountPerusahaan(UpdateAccountPerusahaanRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $validate = $request->validated();

            // Ambil user yang memiliki role PERUSAHAAN
            $user = User::role(RoleEnum::PERUSAHAAN->value)
                ->where('id', $validate['id'])
                ->first();

            if (! $user) {
                DB::rollBack();

                return $this->errorResponse('User dengan role PERUSAHAAN tidak ditemukan.', 404);
            }

            $updateData = [];

            // Periksa perubahan email
            if ($user->email !== $validate['email']) {
                $isEmailExist = User::where('email', $validate['email'])
                    ->where('id', '!=', $user->id)
                    ->whereHas('roles', function ($q) {
                        $q->where('name', RoleEnum::PERUSAHAAN->value);
                    })
                    ->exists();

                if ($isEmailExist) {
                    DB::rollBack();

                    return $this->errorResponse('Email sudah terdaftar untuk role PERUSAHAAN lain.', 422);
                }

                $updateData['email'] = $validate['email'];
            }

            // Nama
            if (isset($validate['name']) && $user->name !== $validate['name']) {
                $updateData['name'] = $validate['name'];
            }

            // Password
            if (! empty($validate['password'])) {
                $updateData['password'] = Hash::make($validate['password']);
            }

            if (isset($validate['role']) && $user->hasRole($validate['role'])) {
                $user->syncRoles($validate['role']);
            }

            // Update data
            if (! empty($updateData)) {
                $user->update($updateData);
            }

            // Update avatar
            if ($request->hasFile('avatar')) {
                $avatar = $request->file('avatar');
                $avatarFilename = Str::random(20).'.'.$avatar->getClientOriginalExtension();

                // Simpan ke disk 'avatar'
                Storage::disk('avatar')->put($avatarFilename, file_get_contents($avatar));

                // Hapus avatar lama jika ada
                if (! empty($user->avatar) && Storage::disk('avatar')->exists(basename($user->avatar))) {
                    Storage::disk('avatar')->delete(basename($user->avatar));
                }

                // Simpan path baru
                $user->avatar = 'avatar/'.$avatarFilename;
                $user->save();
            }

            DB::commit();

            return $this->successResponse('Akun Perusahaan berhasil diupdate.');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('UpdateAccountPerusahaan Error: ', ['error' => $th->getMessage()]);

            return $this->errorResponse('Terjadi kesalahan saat mengupdate akun.', 500);
        }
    }

    /**
     * Method mengembalikan detail akun
     */
    public function getAccountByIdPerusahaan($id): JsonResponse
    {
        try {
            $perusahaan = User::role(RoleEnum::PERUSAHAAN->value)
                ->where('id', $id)
                ->select(['id', 'name', 'email', 'avatar', 'created_at', 'updated_at'])
                ->with([
                    'roles:id,name',
                    'perusahaanProfile:id,nama_perusahaan,alamat,deskripsi,nib,province_id,regencie_id,user_id,industri_id',
                    'perusahaanProfile.province:id,name',
                    'perusahaanProfile.regencies:id,name',
                    'perusahaanProfile.industri:id,name',
                ])
                ->firstOrFail();

            return $this->successResponse($perusahaan);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Akun perusahaan tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            return $this->errorResponse('Terjadi kesalahan saat mengambil akun berdasarkan id.', 500);
        }
    }

    /**
     * Method untuk membuat account kandidat
     *
     * @return \Illuminate\Http\JsonResponse;
     */
    public function createAccountKandidat(CreateAccountKandidatRequest $request): JsonResponse
    {
        try {
            $validate = $request->validated();

            $role = Role::where('name', $validate['role'])->firstOrFail();

            if ($role->name != RoleEnum::USER->value) {
                return $this->errorResponse('Role tidak valid.', 422);
            }

            User::create([
                'name' => $validate['name'],
                'email' => $validate['email'],
                'password' => Hash::make($validate['password']),
            ]);

            User::assignRole(RoleEnum::USER->value);

            return $this->successResponse('Account kandidat berhasil dibuat.');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Role tidak ditemukan.', 500);
        } catch (\Throwable $th) {
            return $this->errorResponse('Terjadi kesalahan saat membuat account kandidat.', 500);
        }
    }

    /**
     * Get all akun kandidat
     */
    public function getAccountKandidat(Request $request): JsonResponse
    {
        try {
            $query = User::role(RoleEnum::USER->value)
                ->select(['id', 'name', 'email', 'avatar', 'created_at', 'updated_at'])
                ->with([
                    'roles:id,name',
                    'userProfile:id,user_id,nik,tanggal_lahir,jenis_kelamin,no_telp,status_kawin',
                ]);

            // Filter berdasarkan nama
            if ($request->has('name')) {
                $query->where('name', 'like', '%'.$request->input('name').'%');
            }

            // Filter berdasarkan NIK
            if ($request->has('nik')) {
                $query->whereHas('userProfile', function ($q) use ($request) {
                    $q->where('nik', 'like', '%'.$request->input('nik').'%');
                });
            }

            // Filter berdasarkan jenis kelamin
            if ($request->has('jenis_kelamin')) {
                $query->whereHas('userProfile', function ($q) use ($request) {
                    $q->where('jenis_kelamin', $request->input('jenis_kelamin'));
                });
            }

            // Filter berdasarkan status kawin
            //            if ($request->has('status_kawin')) {
            //                $query->whereHas('userProfile', function ($q) use ($request) {
            //                    $q->where('status_kawin', $request->input('status_kawin'));
            //                });
            //            }

            // Filter berdasarkan rentang tanggal lahir
            //            if ($request->has('tanggal_lahir_start') && $request->has('tanggal_lahir_end')) {
            //                $query->whereHas('userProfile', function ($q) use ($request) {
            //                    $q->whereBetween('tanggal_lahir', [
            //                        $request->input('tanggal_lahir_start'),
            //                        $request->input('tanggal_lahir_end'),
            //                    ]);
            //                });
            //            }

            $perPage = $request->input('per_page', 15);

            $kandidat = $query->paginate($perPage);

            return $this->paginateResponse($kandidat);
        } catch (\Throwable $th) {
            return $this->errorResponse('Terjadi kesalahan saat mengambil account kandidat.', 500);
        }
    }

    /**
     * Method untuk delete account kandidat
     *
     * @return \Illuminate\Http\JsonResponse;
     */
    public function deleteAccountKandidat($id): JsonResponse
    {
        try {

            $user = User::where('id', $id)
                ->whereHas('roles', function ($query) {
                    $query->where('name', RoleEnum::USER->value);
                })->firstOrFail();

            $user->delete();

            return $this->successResponse('Akun kandidat berhasil dihapus.');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Akun kandidat tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            return $this->errorResponse('Terjadi kesalahan saat menghapus akun kandidat.', 500);
        }
    }

    /**
     * Method untuk update account kandidat
     */
    public function updateAccountKandidat(UpdateAccountKandidatRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $validate = $request->validated();

            // Ambil user yang memiliki role USER
            $user = User::role(RoleEnum::USER->value)
                ->where('id', $validate['id'])
                ->first();

            if (! $user) {
                DB::rollBack();

                return $this->errorResponse('User dengan role USER tidak ditemukan.', 404);
            }

            $updateData = [];

            // Periksa perubahan email
            if ($user->email !== $validate['email']) {
                $isEmailExist = User::where('email', $validate['email'])
                    ->where('id', '!=', $user->id)
                    ->whereHas('roles', function ($q) {
                        $q->where('name', RoleEnum::USER->value);
                    })
                    ->exists();

                if ($isEmailExist) {
                    DB::rollBack();

                    return $this->errorResponse('Email sudah terdaftar untuk role USER lain.', 422);
                }

                $updateData['email'] = $validate['email'];
            }

            // Nama
            if (isset($validate['name']) && $user->name !== $validate['name']) {
                $updateData['name'] = $validate['name'];
            }

            // Password
            if (! empty($validate['password'])) {
                $updateData['password'] = Hash::make($validate['password']);
            }

            if (isset($validate['role']) && $user->hasRole($validate['role'])) {
                $user->syncRoles($validate['role']);
            }

            // Update data
            if (! empty($updateData)) {
                $user->update($updateData);
            }

            // Update avatar
            if ($request->hasFile('avatar')) {
                $avatar = $request->file('avatar');
                $avatarFilename = Str::random(20).'.'.$avatar->getClientOriginalExtension();

                // Simpan ke disk 'avatar'
                Storage::disk('avatar')->put($avatarFilename, file_get_contents($avatar));

                // Hapus avatar lama jika ada
                if (! empty($user->avatar) && Storage::disk('avatar')->exists(basename($user->avatar))) {
                    Storage::disk('avatar')->delete(basename($user->avatar));
                }

                // Simpan path baru
                $user->avatar = 'avatar/'.$avatarFilename;
                $user->save();
            }

            DB::commit();

            return $this->successResponse('Akun Kandidat berhasil diupdate.');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('UpdateAccountKandidat Error: ', ['error' => $th->getMessage()]);

            return $this->errorResponse('Terjadi kesalahan saat mengupdate akun.', 500);
        }
    }

    /**
     * Method untuk mendapatkan account menggunakan id kandidat
     *
     * @return \Illuminate\Http\JsonResponse;
     */
    public function getAccountByIdKandidat($id): JsonResponse
    {
        try {
            $kandidat = User::role(RoleEnum::USER->value)
                ->where('id', $id)
                ->select(['id', 'name', 'email', 'avatar', 'created_at', 'updated_at'])
                ->with([
                    'roles:id,name',
                    'userProfile:id,user_id,nik,tanggal_lahir,jenis_kelamin,no_telp,status_kawin',
                ])->firstOrFail();

            return $this->successResponse($kandidat);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Akun kandidat tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            return $this->errorResponse('Terjadi kesalahan saat mengambil akun berdasarkan id.', 500);
        }
    }
}
