<?php

namespace App\Http\Requests\PerusahaanProfile;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePerusahaanProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_perusahaan' => 'string|max:255',
            'alamat' => 'string|max:255',
            'nib' => 'string|max:50|unique:company_profil,nib',
            'deskripsi' => 'string|max:500',
        ];
    }
}
