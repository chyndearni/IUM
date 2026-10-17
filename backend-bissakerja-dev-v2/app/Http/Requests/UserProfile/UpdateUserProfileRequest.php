<?php

namespace App\Http\Requests\UserProfile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserProfileRequest extends FormRequest
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
            'nik' => 'required|string|unique:user_profiles,nik,'.$this->userProfileId(),
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'no_telp' => 'required|string',
            'latar_belakang' => 'required|string',
            'status_kawin' => 'required|in:1,2',
            'disabilitas_id' => 'required|exists:disabilitas,id',
        ];
    }

    private function userProfileId()
    {
        return optional($this->user()->userProfile)->id ?? 'null';
    }
}
