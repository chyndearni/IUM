<?php

namespace App\Http\Controllers;

use App\Http\Requests\Superadmin\AssignRoleToUserRequest;
use App\Http\Requests\Superadmin\CreateRoleRequest;
use App\Models\User;
use App\Trait\ApiResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    use ApiResponse;

    /**
     * Method return roles
     */
    public function getRole(): JsonResponse
    {
        try {
            $roles = Role::all();

            return $this->successResponse($roles, 200);
        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Method untuk membuat roles baru
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createRole(CreateRoleRequest $request)
    {
        try {
            $validate = $request->validated();
            $role = Role::create([
                'name' => $validate['name'],
                'guard_name' => 'api', z,
            ]);

            return $this->successResponse('Role baru berhasil dibuat.', 201);
        } catch (\Throwable $th) {
            return $this->errorResponse('Gagal saat membuat role baru', 500);
        }
    }

    /**
     * Method untuk memberikan roles ke user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function assignRoleToUser(AssignRoleToUserRequest $request)
    {
        try {
            $validate = $request->validated();

            $user = User::findOrFail($validate['user_id']);
            $role = Role::findOrFail($validate['role_id']);

            // Cek apakah user sudah memiliki role yang sama
            if ($user->hasRole($role)) {
                return $this->errorResponse('User sudah memiliki role ini.', 422);
            }

            // Berikan role ke user
            $user->syncRoles([$role->name]);

            return $this->successResponse('Role berhasil diberikan ke user.');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('User tidak ditemukan.', 404);
        } catch (\Throwable $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }
}
