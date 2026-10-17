<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdminLowongan\StoreRequest;
use App\Http\Requests\AdminLowongan\UpdateRequest;
use App\Models\LowonganKerja;
use App\Trait\ApiResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;

class AdminLowonganController extends Controller
{
    use ApiResponse;

    /**
     * Method untuk menampilkan daftar semua lowongan kerja
     */
    public function index(): JsonResponse
    {
        try {
            $lowongan = LowonganKerja::with(['tipePekerjaan', 'disabilitas', 'perusahaan'])->get();

            return $this->successResponse($lowongan);
        } catch (\Throwable $th) {
            return $this->errorResponse('Gagal mengambil data lowongan kerja', 500);
        }
    }

    /**
     * Method untuk menambahkan lowongan kerja baru
     */
    public function store(StoreRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            if ($request->hasFile('gambar')) {
                $path = $request->file('gambar')->store('lowongan', 'public');
                $validated['gambar'] = $path;
            }

            $lowongan = LowonganKerja::create($validated);

            return $this->successResponse([
                'message' => 'Lowongan kerja berhasil ditambahkan',
                'data' => $lowongan,
            ], 201);
        } catch (\Throwable $th) {
            return $this->errorResponse('Gagal menambahkan lowongan kerja', 500);
        }
    }

    /**
     * Method untuk menampilkan detail lowongan kerja berdasarkan ID
     *
     * @param  int  $id
     */
    public function show($id): JsonResponse
    {
        try {
            $lowongan = LowonganKerja::with(['tipePekerjaan', 'disabilitas', 'perusahaan'])->findOrFail($id);

            return $this->successResponse($lowongan);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Lowongan kerja tidak ditemukan', 404);
        } catch (\Throwable $th) {
            return $this->errorResponse('Gagal menampilkan data', 500);
        }
    }

    /**
     * Method untuk memperbarui data lowongan kerja berdasarkan ID
     *
     * @param  int  $id
     */
    public function update(UpdateRequest $request, $id): JsonResponse
    {
        try {
            $lowongan = LowonganKerja::findOrFail($id);
            $validated = $request->validated();

            if ($request->hasFile('gambar')) {
                $path = $request->file('gambar')->store('lowongan', 'public');
                $validated['gambar'] = $path;
            }

            $lowongan->update($validated);

            return $this->successResponse([
                'message' => 'Lowongan kerja berhasil diperbarui',
                'data' => $lowongan,
            ]);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Lowongan kerja tidak ditemukan', 404);
        } catch (\Throwable $th) {
            return $this->errorResponse('Gagal memperbarui data', 500);
        }
    }

    /**
     * Method untuk menghapus lowongan kerja berdasarkan ID
     *
     * @param  int  $id
     */
    public function destroy($id): JsonResponse
    {
        try {
            $lowongan = LowonganKerja::findOrFail($id);
            $lowongan->delete();

            return $this->successResponse(['message' => 'Lowongan kerja berhasil dihapus']);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Lowongan kerja tidak ditemukan', 404);
        } catch (\Throwable $th) {
            return $this->errorResponse('Gagal menghapus lowongan kerja', 500);
        }
    }

    /**
     * Method untuk memperbarui status lowongan kerja berdasarkan ID
     *
     * @param  int  $id
     */
    public function updateStatus($id): JsonResponse
    {
        try {
            $lowongan = LowonganKerja::findOrFail($id);
            $lowongan->status = ! $lowongan->status;
            $lowongan->save();

            return $this->successResponse([
                'message' => 'Status lowongan diperbarui',
                'status' => $lowongan->status,
            ]);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Lowongan kerja tidak ditemukan', 404);
        } catch (\Throwable $th) {
            return $this->errorResponse('Gagal memperbarui status', 500);
        }
    }
}
