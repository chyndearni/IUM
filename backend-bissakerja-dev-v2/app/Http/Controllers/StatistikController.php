<?php

namespace App\Http\Controllers;

use App\Enum\KeyStatistikEnum;
use App\Models\Statistik;
use App\Trait\ApiResponse;
use App\Trait\RoleCheck;

class StatistikController extends Controller
{
    use ApiResponse, RoleCheck;

    public function getStatistikLowongan()
    {
        try {
            if ($this->isAllRoles()) {
                return $this->errorResponse('Unauthorized', 401);
            }

            $data = Statistik::where('key', KeyStatistikEnum::TOTAL_LOWONGAN->value)->first();

            return $this->successResponse($data);

        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function getStatistikPerusahaan()
    {

        try {
            if ($this->isAllRoles()) {
                return $this->errorResponse('Unauthorized', 401);
            }

            $data = Statistik::where('key', KeyStatistikEnum::TOTAL_PERUSAHAAN->value)->first();

            return $this->successResponse($data);

        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function getStatistikKandidat()
    {
        try {
            if ($this->isAllRoles()) {
                return $this->errorResponse('Unauthorized', 401);
            }

            $data = Statistik::where('key', KeyStatistikEnum::TOTAL_KANDIDAT->value)->first();

            return $this->successResponse($data);

        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
}
