<?php

namespace App\Http\Requests\UserProfile;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserProfileRequest extends FormRequest
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
            'nik' => 'required|unique:user_profiles,nik',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'no_telp' => 'required|string',
            'latar_belakang' => 'string',
            'status_kawin' => 'required|in:1,2',
            // 'regencie_id' => 'required|exists:regencies,id',
            'user_id' => 'required|exists:users,id',
            'disabilitas_id' => 'required|exists:disabilitas,id',
        ];
    }
}
