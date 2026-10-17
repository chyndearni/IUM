<?php

namespace App\Enum;

enum RoleEnum: string
{
    case SUPER_ADMIN = 'superadmin';
    case ADMIN = 'admin';
    case USER = 'user';
    case PERUSAHAAN = 'perusahaan';
}
