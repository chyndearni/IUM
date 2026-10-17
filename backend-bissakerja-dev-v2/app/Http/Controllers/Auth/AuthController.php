<?php

namespace App\Http\Controllers\Auth;

use App\Enum\RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\PerusahaanProfile;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'avatar' => $request->avatar ?? null,
                'role' => $request->role,
            ]);

            $user->assignRole($request->role);

            if ($request->role === 'perusahaan') {
                PerusahaanProfile::create([
                    'nama_perusahaan' => $user->name,
                    'user_id' => $user->id,
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'User registered successfully',
                'user' => $user,
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function login(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email', 'password' => 'required|min:6',]);

        if ($request->role === RoleEnum::ADMIN->value || $request->role === RoleEnum::SUPER_ADMIN->value) {
            return response()->json(
                [
                    'status' => false,
                    'message' => 'You do not have permission to register an admin user.',
                ],
                403
            );
        }

        if (Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $user = Auth::user();
            return response()->json([
                'status' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                    'role' => $user->getRoleNames()->first(),
                    'token' => $user->createToken($user->name)->plainTextToken,
                ],
            ], 200);
        }
        return response()->json(['status' => false, 'message' => 'Login Failed',], 401);
    }



    public function user(Request $request)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'status' => true,
            'user' => $user,
            'role' => $user->getRoleNames()->first(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        try {
            DB::beginTransaction();

            $user = Auth::user();

            if (! $user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not authenticated',
                ], 401);
            }

            // Validation rules
            $rules = [
                'name' => 'required|string|max:255',
            ];

            // Add password validation if password is being updated
            if ($request->filled('password')) {
                $rules['current_password'] = 'required|string';
                $rules['password'] = 'required|string|min:6|confirmed';
            }

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Verify current password if updating password
            if ($request->filled('password')) {
                if (! Hash::check($request->current_password, $user->password)) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Current password is incorrect',
                        'errors' => [
                            'current_password' => ['Current password is incorrect'],
                        ],
                    ], 422);
                }
            }

            // Update user data
            $updateData = [
                'name' => $request->name,
            ];

            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            DB::commit();

            // Return updated user data
            $updatedUser = $user->fresh();
            $updatedUser->makeHidden(['password', 'remember_token']);

            Log::info('Profile updated successfully', ['user_id' => $user->id]);

            return response()->json([
                'status' => true,
                'message' => 'Profile updated successfully',
                'user' => $updatedUser,
                'role' => $updatedUser->getRoleNames()->first(),
            ], 200);
        } catch (ValidationException $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Profile update error', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating profile',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    /**
     * Update avatar - Support both base64 and file upload
     */
    public function updateAvatar(Request $request)
    {
        try {
            $user = Auth::user();

            if (! $user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            Log::info('Avatar update request', [
                'user_id' => $user->id,
                'content_type' => $request->header('Content-Type'),
                'has_file' => $request->hasFile('avatar'),
                'has_avatar_field' => $request->has('avatar'),
            ]);

            // Check if it's a file upload or base64
            if ($request->hasFile('avatar')) {
                return $this->handleFileUpload($request, $user);
            } elseif ($request->has('avatar')) {
                return $this->handleBase64Upload($request, $user);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'No avatar data provided',
                    'errors' => [
                        'avatar' => ['Please provide an avatar file or base64 data'],
                    ],
                ], 422);
            }
        } catch (Exception $e) {
            Log::error('Avatar update error: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating profile photo',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    /**
     * Handle file upload (multipart/form-data)
     */
    private function handleFileUpload(Request $request, $user)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|file|mimes:jpeg,jpg,png,gif|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $file = $request->file('avatar');

        // Delete old avatar if exists
        $this->deleteOldAvatar($user);

        // Generate unique filename
        $extension = $file->getClientOriginalExtension();
        $filename = 'avatars/' . $user->id . '_' . Str::random(10) . '.' . $extension;

        // Store the file
        $path = $file->storeAs('public/' . dirname($filename), basename($filename));

        if (! $path) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to save image',
                'errors' => [
                    'avatar' => ['Unable to save image file'],
                ],
            ], 500);
        }

        // Update user avatar path
        $relativePath = str_replace('public/', '', $path);
        $user->avatar = Storage::url($relativePath);
        $user->save();

        Log::info('Avatar uploaded successfully via file upload', [
            'user_id' => $user->id,
            'path' => $relativePath,
        ]);

        return $this->avatarUpdateResponse($user);
    }

    /**
     * Handle base64 upload
     */
    private function handleBase64Upload(Request $request, $user)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $avatarData = $request->input('avatar');

        // Validate base64 image format
        if (! $this->isValidBase64Image($avatarData)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid image format',
                'errors' => [
                    'avatar' => ['Please provide a valid image file (JPEG, PNG, GIF)'],
                ],
            ], 422);
        }

        // Extract image data and extension
        $imageInfo = $this->extractImageInfo($avatarData);

        if (! $imageInfo) {
            return response()->json([
                'status' => false,
                'message' => 'Unable to process image',
                'errors' => [
                    'avatar' => ['Invalid image data'],
                ],
            ], 422);
        }

        // Validate image size (max 5MB)
        $imageSize = strlen(base64_decode($imageInfo['data']));
        $maxSize = 5 * 1024 * 1024; // 5MB

        if ($imageSize > $maxSize) {
            return response()->json([
                'status' => false,
                'message' => 'Image too large',
                'errors' => [
                    'avatar' => ['Image size must be less than 5MB'],
                ],
            ], 422);
        }

        // Delete old avatar if exists
        $this->deleteOldAvatar($user);

        // Generate unique filename
        $filename = 'avatars/' . $user->id . '_' . Str::random(10) . '.' . $imageInfo['extension'];

        // Store the image
        $stored = Storage::disk('public')->put($filename, base64_decode($imageInfo['data']));

        if (! $stored) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to save image',
                'errors' => [
                    'avatar' => ['Unable to save image file'],
                ],
            ], 500);
        }

        // Update user avatar path
        $user->avatar = Storage::url($filename);
        $user->save();

        Log::info('Avatar uploaded successfully via base64', [
            'user_id' => $user->id,
            'filename' => $filename,
        ]);

        return $this->avatarUpdateResponse($user);
    }

    /**
     * Delete old avatar file
     */
    private function deleteOldAvatar($user)
    {
        if ($user->avatar) {
            // Extract path from URL
            $path = str_replace('/storage/', '', parse_url($user->avatar, PHP_URL_PATH));
            if ($path && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
                Log::info('Old avatar deleted', ['user_id' => $user->id, 'path' => $path]);
            }
        }
    }

    /**
     * Standard avatar update response
     */
    private function avatarUpdateResponse($user)
    {
        return response()->json([
            'status' => true,
            'message' => 'Profile photo updated successfully!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'role' => $user->role,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'role' => $user->getRoleNames()->first(),
        ], 200);
    }

    /**
     * Validate if string is a valid base64 image
     */
    private function isValidBase64Image($data)
    {
        // Check if it's a data URL format
        if (! preg_match('/^data:image\/(\w+);base64,/', $data)) {
            return false;
        }

        // Extract the base64 part
        $base64 = substr($data, strpos($data, ',') + 1);

        // Validate base64
        if (! base64_decode($base64, true)) {
            return false;
        }

        return true;
    }

    /**
     * Extract image info from base64 data URL
     */
    private function extractImageInfo($data)
    {
        // Match data URL pattern
        if (! preg_match('/^data:image\/(\w+);base64,(.+)$/', $data, $matches)) {
            return false;
        }

        $extension = $matches[1];
        $base64Data = $matches[2];

        // Validate extension
        $allowedExtensions = ['jpeg', 'jpg', 'png', 'gif'];
        if (! in_array(strtolower($extension), $allowedExtensions)) {
            return false;
        }

        // Normalize jpeg extension
        if ($extension === 'jpeg') {
            $extension = 'jpg';
        }

        return [
            'extension' => $extension,
            'data' => $base64Data,
        ];
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Logout successful',
        ], 200);
    }
}
