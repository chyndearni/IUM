<?php

namespace App\Http\Requests\Perusahaan;

use Illuminate\Foundation\Http\FormRequest;

class StorePostLowonganRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Atur sesuai kebutuhan autentikasi
    }

    public function rules(): array
    {
        return [
            'nama_lowongan' => 'required|string|max:255',

            'model_kerja_id' => 'required|exists:model_kerja,id',
            'tipe_pekerjaan_id' => 'required|exists:tipe_pekerjaan,id',
            'industris_id' => 'required|exists:industris,id',

            'min_gaji' => 'nullable|numeric|min:0',
            'max_gaji' => 'nullable|numeric|gte:min_gaji',

            'disabilitas_id' => 'required|exists:disabilitas,id',
            'pendidikan_lowongan_id' => 'required|exists:pendidikan_lowongan,id',
            'pengalaman_kerja_lowongan_id' => 'required|exists:pengalaman_kerja_lowongan,id',

            'deskripsi_pekerjaan' => 'required|string',
            'benefit' => 'nullable|string',
            'kualifikasi' => 'nullable|string',

            'perusahaan_profiles_id' => 'required|exists:perusahaan_profiles,id',

            'alamat_lengkap' => 'required|string|max:500',
            'regencies_id' => 'required|exists:regencies,id',
            'provinces_id' => 'required|exists:provinces,id',
            'districts_id' => 'required|exists:districts,id',

            'expired_date' => 'required|date|after:today',
            'status' => 'required|in:aktif,nonaktif',
        ];
    }

    public function messages(): array
    {
        return [
            'expired_date.after' => 'Tanggal expired harus lebih dari hari ini.',
            'max_gaji.gte' => 'Gaji maksimum harus lebih besar atau sama dengan gaji minimum.',
            'status.in' => 'Status hanya boleh bernilai aktif atau nonaktif.',
        ];
    }
}
