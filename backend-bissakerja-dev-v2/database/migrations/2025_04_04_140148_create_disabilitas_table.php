<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('disabilitas', function (Blueprint $table) {
            $table->id();
            $table->string('kategori_disabilitas');
            $table->string('tingkat_disabilitas');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('disabilitas');
    }
};
