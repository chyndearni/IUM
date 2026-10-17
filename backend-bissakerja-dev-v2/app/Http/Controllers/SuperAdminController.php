<?php

namespace App\Http\Controllers;

use App\Enum\RoleEnum;
use App\Http\Requests\Superadmin\CreateAccountDisnakerDaerahRequest;
use App\Http\Requests\Superadmin\UpdateAccountDisnakerDaerahRequest;
use App\Models\AdminProfile;
use App\Models\Disabilitas;
use App\Models\Province;
use App\Models\Regency;
use App\Models\User;
use App\Trait\ApiResponse;
use App\Trait\RoleCheck;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SuperAdminController extends Controller
{
    use ApiResponse, RoleCheck;

    /**
     * Method untuk membuat akun disnaker daerah
     *
     * @return \Illuminate\Http\JsonResponse;
     */
    public function createAccountDisnakerDaerah(CreateAccountDisnakerDaerahRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $validate = $request->validated();

            $user = User::create([
                'name' => $validate['name'],
                'email' => $validate['email'],
                'password' => Hash::make($validate['password']),
            ]);

            $user->assignRole(RoleEnum::ADMIN->value);

            $adminProfile = AdminProfile::create([
                'district_id' => $validate['district_id'] ?? null,
                'village_id' => $validate['village_id'] ?? null,
                'user_id' => $user->id,
                'regencie_id' => $validate['regencie_id'],
                'province_id' => $validate['province_id'],
            ]);
            DB::commit();

            return $this->successResponse('Akun disnaker daerah berhasil dibuat.');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return $this->errorResponse('Role tidak ditemukan.', 500);
        } catch (\Throwable $th) {
            DB::rollBack();

            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    /**
     * Method untuk menghapus akun disnaker daerah
     *
     * @return \Illuminate\Http\JsonResponse;
     */
    public function deleteAccountDisnakerDaerah($id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $user = User::where('id', $id)
                ->lockForUpdate()
                ->whereHas('roles', function ($query) {
                    $query->where('name', RoleEnum::ADMIN->value);
                })->firstOrFail();

            $user->delete();
            DB::commit();

            return $this->successResponse('Akun Disnaker Daerah berhasil dihapus.');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return $this->errorResponse('Akun Disnaker Daerah tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            DB::rollBack();

            return $this->errorResponse('Terjadi kesalahan saat menghapus akun Disnaker Daerah.', 500);
        }
    }

    /**
     * Method untuk menampilkan akun disnaker daerah
     *
     * @return \Illuminate\Http\JsonResponse;
     */
    public function getAccountDisnakerDaerah(Request $request): JsonResponse
    {
        try {

            $query = User::with([
                'roles:id,name',
                'adminProfile.province',
                'adminProfile.regencies',
                'adminProfile.district',
                'adminProfile.village',
            ])->role(RoleEnum::ADMIN->value);

            // Filter berdasarkan Province
            if ($request->has('province')) {
                $query->whereHas('adminProfile.province', function ($q) use ($request) {
                    // $provinceId = strval($request->input('province'));
                    $q->where('id', $request->input('province'))->select('id', 'name');
                });
            }

            // Filter berdasarkan Regency
            if ($request->has('regencies')) {
                $query->whereHas('adminProfile.regencies', function ($q) use ($request) {
                    $q->where('id', $request->input('regencies'))->select('id', 'name');
                });
            }

            // Filter berdasarkan District
            if ($request->has('district')) {
                $query->whereHas('adminProfile.district', function ($q) use ($request) {
                    $q->where('id', $request->input('district'))->select('id', 'name');
                });
            }

            // Filter berdasarkan Village
            if ($request->has('village')) {
                $query->whereHas('adminProfile.village', function ($q) use ($request) {
                    $q->where('id', $request->input('village'))->select('id', 'name');
                });
            }

            if ($request->has('name')) {
                $query->where('name', 'like', '%' . $request->input('name') . '%');
            }

            $perPage = $request->input('per_page', 15);

            // Ambil data hasil query dengan pagination
            $disnakerDaerah = $query->paginate($perPage);

            return $this->paginateResponse($disnakerDaerah);
        } catch (\Throwable $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    /**
     * Method untuk update account kandidat
     */
    public function updateAccountDisnakerDaerah(UpdateAccountDisnakerDaerahRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $validate = $request->validated();

            // Ambil user yang memiliki role ADMIN
            $user = User::role(RoleEnum::ADMIN->value)
                ->where('id', $validate['id'])
                ->first();

            if (! $user) {
                DB::rollBack();

                return $this->errorResponse('User dengan role ADMIN tidak ditemukan.', 404);
            }

            $updateData = [];

            // Periksa perubahan email
            if ($user->email !== $validate['email']) {
                $isEmailExist = User::where('email', $validate['email'])
                    ->where('id', '!=', $user->id)
                    ->whereHas('roles', function ($q) {
                        $q->where('name', RoleEnum::ADMIN->value);
                    })
                    ->exists();

                if ($isEmailExist) {
                    DB::rollBack();

                    return $this->errorResponse('Email sudah terdaftar untuk role ADMIN lain.', 422);
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
                $user->syncRoles([$validate['role']]);
            }

            // Update data
            if (! empty($updateData)) {
                $user->update($updateData);
            }

            // Update avatar
            if ($request->hasFile('avatar')) {
                $avatar = $request->file('avatar');
                $avatarFilename = Str::random(20) . '.' . $avatar->getClientOriginalExtension();

                // Simpan ke disk 'avatar'
                Storage::disk('avatar')->put($avatarFilename, file_get_contents($avatar));

                // Hapus avatar lama jika ada
                if (! empty($user->avatar) && Storage::disk('avatar')->exists(basename($user->avatar))) {
                    Storage::disk('avatar')->delete(basename($user->avatar));
                }

                // Simpan path baru
                $user->avatar = 'avatar/' . $avatarFilename;
                $user->save();
            }

            DB::commit();

            return $this->successResponse('Akun disnaker daerah berhasil diupdate.');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('UpdateAccountDisnakerDaerah Error: ', ['error' => $th->getMessage()]);

            return $this->errorResponse('Terjadi kesalahan saat mengupdate akun.', 500);
        }
    }

    /**
     * Method untuk mendapatkan account menggunakan id
     *
     * @return \Illuminate\Http\JsonResponse;
     */
    public function getAccountByIdDisnakerDaerah($id): JsonResponse
    {
        try {

            $disnakerDaerah = User::where('id', $id)
                ->select(['id', 'name', 'email', 'avatar', 'created_at', 'updated_at'])
                ->with(['roles:id,name', 'adminProfile.province:id,name', 'adminProfile.regencies:id,name', 'adminProfile.district:id,name', 'adminProfile.village:id,name'])
                ->role(RoleEnum::ADMIN->value)
                ->firstOrFail();

            return $this->successResponse($disnakerDaerah);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Akun disnaker daerah tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    public function createDisabilitas(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kategori_disabilitas' => 'required|string|max:191',
        ]);

        $kategori = ucwords(strtolower(trim($validated['kategori_disabilitas'])));
        $levels = ['Ringan', 'Sedang', 'Berat'];

        try {
            DB::transaction(function () use ($kategori, $levels) {
                foreach ($levels as $level) {
                    // Cegah duplikasi kategori+tingkat
                    $exists = Disabilitas::where('kategori_disabilitas', $kategori)
                        ->where('tingkat_disabilitas', $level)
                        ->exists();

                    if (!$exists) {
                        Disabilitas::create([
                            'kategori_disabilitas' => $kategori,
                            'tingkat_disabilitas'  => $level,
                        ]);
                    }
                }
            });

            return $this->successResponse('Disabilitas berhasil ditambahkan.');
        } catch (\Throwable $e) {
            Log::channel('log_error')->error($e->getMessage());
            return $this->errorResponse('Gagal membuat kategori disabilitas', 500);
        }
    }

    public function updateDisabilitas($id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kategori_disabilitas' => 'sometimes|required|string|max:191',
            'tingkat_disabilitas'  => 'sometimes|required|string|in:Ringan,Sedang,Berat',
        ]);

        try {
            $row = Disabilitas::findOrFail($id);

            if (isset($validated['kategori_disabilitas'])) {
                $row->kategori_disabilitas = strtolower(trim($validated['kategori_disabilitas']));
            }
            if (isset($validated['tingkat_disabilitas'])) {
                $row->tingkat_disabilitas = $validated['tingkat_disabilitas'];
            }

            // Cegah duplikasi jika user mengganti ke kombinasi yang sudah ada
            $exists = Disabilitas::where('id', '!=', $row->id)
                ->where('kategori_disabilitas', $row->kategori_disabilitas)
                ->where('tingkat_disabilitas', $row->tingkat_disabilitas)
                ->exists();

            if ($exists) {
                return $this->errorResponse('Kombinasi kategori dan tingkat sudah ada.', 422);
            }

            $row->save();

            return $this->successResponse('Disabilitas berhasil diupdate.');
        } catch (\Throwable $e) {
            Log::channel('log_error')->error($e->getMessage());
            return $this->errorResponse('Gagal memperbarui disabilitas', 500);
        }
    }

    public function deleteDisabilitas($id): JsonResponse
    {
        try {
            Disabilitas::findOrFail($id)->delete();
            return $this->successResponse('Disabilitas berhasil dihapus.');
        } catch (\Throwable $e) {
            Log::channel('log_error')->error($e->getMessage());
            return $this->errorResponse('Gagal menghapus disabilitas', 500);
        }
    }

    /**
     * Mengambil semua data disabilitas.
     *
     * @return JsonResponse
     */
    public function getDisabilitas()
    {
        // if ($this->isAllRoles()) {
        //     return $this->errorResponse('Tidak dapat menampilkan disabilitas.', 403);
        // }
        try {
            $data = Disabilitas::all();

            return $this->successResponse($data);
        } catch (\Throwable $e) {
            Log::channel('log_error')->error($e->getMessage());

            return $this->errorResponse('Gagal mengambil disabilitas', 500);
        }
    }
}
