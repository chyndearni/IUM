<?php

namespace App\Trait;

use App\Enum\RoleEnum;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

trait RoleCheck
{
    public function isAdmin()
    {
        return Auth::user()->hasRole([RoleEnum::ADMIN->value, RoleEnum::SUPER_ADMIN->value]);
    }

    public function isSuperAdmin()
    {
        return Auth::user()->hasRole([RoleEnum::SUPER_ADMIN->value]);
    }

    public function isUser()
    {
        return Auth::user()->hasRole([RoleEnum::USER->value, RoleEnum::ADMIN->value, RoleEnum::SUPER_ADMIN->value]);
    }

    public function isPerusahaan()
    {
        return Auth::user()->hasRole([RoleEnum::PERUSAHAAN->value, RoleEnum::SUPER_ADMIN->value, RoleEnum::ADMIN->value, RoleEnum::SUPER_ADMIN->value]);
    }

    public function isAllRoles()
    {
        return Auth::user()->hasAllRoles(Role::all());
    }
}
