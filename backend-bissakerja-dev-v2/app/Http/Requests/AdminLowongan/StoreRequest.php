<?php

namespace App\Http\Requests\AdminLowongan;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'tipe_pekerjaan_id' => 'required|exists:tipe_pekerjaan,id',
            'min_gaji' => 'nullable|numeric',
            'max_gaji' => 'nullable|numeric',
            'disabilitas_id' => 'required|exists:disabilitas,id',
            'deskripsi_pekerjaan' => 'required|string',
            'lokasi' => 'required|string',
            'perusahaan_profile_id' => 'required|exists:company_profil,id',
            'status' => 'boolean',
        ];
    }
}
