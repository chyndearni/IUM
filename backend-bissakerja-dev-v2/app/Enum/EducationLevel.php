<?php

namespace App\Enum;

enum EducationLevel: string
{
    case NONE = 'Tidak Pernah';
    case ELEMENTARY = 'SD / MI';
    case JUNIOR_HIGH = 'SMP / MTs';
    case SENIOR_HIGH = 'SMA / SMK / MA';
    case DIPLOMA = 'Diploma (D1/D2/D3)';
    case BACHELOR = 'Sarjana (S1)';
    case MASTER = 'Magister (S2)';
    case DOCTOR = 'Doktor (S3)';
}
