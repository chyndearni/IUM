<?php

namespace App\Http\Controllers;

use App\Models\District;
use App\Models\Province;
use App\Models\Regency;
use App\Models\Village;
use App\Trait\ApiResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    use ApiResponse;

    // Mendapatkan semua provinsi
    public function getProvince()
    {
        try {

            $provinces = Province::select('id', 'name')->get();

            return $this->successResponse($provinces);
        } catch (\Throwable $e) {
            return $this->errorResponse('Terjadi kesalahan saat mengambil data provinsi.', 500);
        }
    }

    // Mendapatkan semua regencies berdasarkan provinsi
    public function getRegencies(Request $request)
    {
        try {
            $provinceId = $request->input('province_id');

            if (! $provinceId) {
                return $this->errorResponse("Parameter 'province_id' diperlukan.", 400);
            }

            $regencies = Regency::select('id', 'name', 'province_id')
                ->where('province_id', $provinceId)
                ->get();

            if ($regencies->isEmpty()) {
                return $this->errorResponse('Tidak ada data kabupaten/kota untuk provinsi ini.', 404);
            }

            return $this->successResponse($regencies);
        } catch (\Throwable $e) {
            return $this->errorResponse('Terjadi kesalahan saat mengambil data kabupaten/kota.', 500);
        }
    }

    // Mendapatkan semua districts berdasarkan regency
    public function getDistricts(Request $request)
    {
        try {
            $regencyId = $request->input('regencie_id');

            if (! $regencyId) {
                return $this->errorResponse("Parameter 'regencie_id' diperlukan.", 400);
            }

            $districts = District::select('id', 'name', 'regency_id')
                ->where('regency_id', $regencyId)
                ->get();

            if ($districts->isEmpty()) {
                return $this->errorResponse('Tidak ada data kecamatan untuk kabupaten/kota ini.', 404);
            }

            return $this->successResponse($districts);
        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    // Mendapatkan semua villages berdasarkan district
    public function getVillages(Request $request)
    {
        try {
            $districtId = $request->input('district_id');

            if (! $districtId) {
                return $this->errorResponse("Parameter 'district_id' diperlukan.", 400);
            }

            $villages = Village::select('id', 'name', 'district_id')
                ->where('district_id', $districtId)
                ->get();

            if ($villages->isEmpty()) {
                return $this->errorResponse('Tidak ada data desa/kelurahan untuk kecamatan ini.', 404);
            }

            return $this->successResponse($villages);
        } catch (\Throwable $e) {
            return $this->errorResponse('Terjadi kesalahan saat mengambil data desa/kelurahan.', 500);
        }
    }
}
