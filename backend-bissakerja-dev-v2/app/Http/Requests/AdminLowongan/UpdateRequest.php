<?php

namespace App\Http\Requests\AdminLowongan;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama' => 'sometimes|required|string|max:255',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'tipe_pekerjaan_id' => 'sometimes|required|exists:tipe_pekerjaan,id',
            'min_gaji' => 'nullable|numeric',
            'max_gaji' => 'nullable|numeric',
            'disabilitas_id' => 'sometimes|required|exists:disabilitas,id',
            'deskripsi_pekerjaan' => 'sometimes|required|string',
            'lokasi' => 'sometimes|required|string',
            'perusahaan_profile_id' => 'sometimes|required|exists:company_profil,id',
            'status' => 'boolean',
        ];
    }
}
