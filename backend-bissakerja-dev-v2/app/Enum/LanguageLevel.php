<?php

namespace App\Enum;

enum LanguageLevel: string
{
    case BEGINNER = 'Beginner';
    case INTERMEDIATE = 'Intermediate';
    case ADVANCED = 'Advanced';
    case FLUENT = 'Fluent';
    case NATIVE = 'Native';
}
