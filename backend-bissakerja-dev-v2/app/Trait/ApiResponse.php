<?php

namespace App\Trait;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    public function successResponse($data, $code = 200): JsonResponse
    {
        return response()->json([
            'data' => $data,
        ], $code);
    }

    public function paginateResponse($data, $code = 200): JsonResponse
    {
        return response()->json($data, $code);
    }

    public function errorResponse($message, $code = 400): JsonResponse
    {
        return response()->json([
            'error' => $message,
        ], $code);
    }
}
