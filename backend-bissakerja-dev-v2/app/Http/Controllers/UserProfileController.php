<?php

namespace App\Http\Controllers;

use App\Enum\RoleEnum;
use App\Http\Requests\UserProfile\CreateUserProfileRequest;
use App\Http\Requests\UserProfile\UpdateUserProfileRequest;
use App\Models\User;
use App\Models\UserProfile;
use App\Trait\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserProfileController extends Controller
{
    use ApiResponse;

    /**
     * Menampilkan user profile by id
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function showUserProfile($id)
    {
        try {
            $data = User::with([
                'userProfile',
                'userProfile.disabilitas',
                'userProfile.resume',
            ])->find($id);

            if (! $data) {
                return $this->errorResponse('User not found', 404);
            }

            if (! $data->hasRole(RoleEnum::USER->value)) {
                return $this->errorResponse('Unauthorized', 401);
            }

            return $this->successResponse($data);
        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Membuat user profile
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createUserProfile(CreateUserProfileRequest $request)
    {
        try {
            $data = $request->validated();

            if ($data['user_id'] != Auth::id()) {
                return $this->errorResponse('Unauthorized', 401);
            }

            if (UserProfile::where('user_id', Auth::id())->exists()) {
                return $this->errorResponse('User profile already exists', 409);
            }

            $userProfile = UserProfile::create([
                'user_id' => Auth::id(),
                'nik' => $data['nik'],
                'tanggal_lahir' => $data['tanggal_lahir'],
                'jenis_kelamin' => $data['jenis_kelamin'],
                'no_telp' => $data['no_telp'],
                'latar_belakang' => $data['latar_belakang'],
                'status_kawin' => $data['status_kawin'],
                // 'regencie_id' => $data['regencie_id'],
                'disabilitas_id' => $data['disabilitas_id'],
            ]);

            if ($userProfile) {
                $this->successResponse($userProfile);

                return;
            }

            $this->errorResponse('Failed to create user profile', 500);

            return;
        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * method untuk melakukan update user profile
     *
     * @return void
     */
    public function updateUserProfile(UpdateUserProfileRequest $request)
    {
        try {
            $user = Auth::user();

            $userProfile = $user->userProfile;

            if (! $userProfile) {
                return response()->json([
                    'error' => 'User profile not found',
                ], 404);
            }

            $data = $request->validated();

            $userProfile->update([
                'user_id' => $user->id,
                'nik' => $data['nik'],
                'tanggal_lahir' => $data['tanggal_lahir'],
                'jenis_kelamin' => $data['jenis_kelamin'],
                'no_telp' => $data['no_telp'],
                'latar_belakang' => $data['latar_belakang'],
                'status_kawin' => $data['status_kawin'],
                'disabilitas_id' => $data['disabilitas_id'],
            ]);

            return response()->json([
                'message' => 'Profile updated successfully',
                'data' => $userProfile,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }
}
