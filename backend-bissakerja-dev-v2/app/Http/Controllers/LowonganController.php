<?php

namespace App\Http\Controllers;

use App\Models\PostLowongan;

class LowonganController extends Controller
{
    public function index()
    {
        $data = PostLowongan::with(['perusahaanProfile', 'disabilitas'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar lowongan berhasil diambil',
            'data' => $data,
        ], 200);
    }

    public function show($id)
    {
        $lowongan = PostLowongan::with(['perusahaanProfile', 'disabilitas'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Detail lowongan berhasil diambil',
            'data' => $lowongan,
        ], 200);
    }



    public function masterDataLowongan()
    {
        $data = PostLowongan::with(['perusahaanProfile', 'disabilitas'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar lowongan berhasil diambil',
            'data' => $data,
        ], 200);
    }
}
