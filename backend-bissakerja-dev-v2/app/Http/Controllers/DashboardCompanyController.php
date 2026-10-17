<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardCompanyController extends Controller
{
    public function getAllDataCompany()
    {
        $userId = Auth::user()->id;
        if (!$userId) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $data = User::with([
            'perusahaanProfile',
            'perusahaanProfile.lowongan',
            'perusahaanProfile.lowongan.lamaran'
        ])->find($userId);
        return response()->json([
            'status' => true,
            'message' => 'All data for company dashboard',
            'data' => $data,
        ], 200);
    }
}
