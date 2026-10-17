<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('undangan_talent_pools', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('perusahaan_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('post_lowongan_id')->constrained('post_lowongan')->cascadeOnDelete();
            $table->enum('status', ['Menunggu', 'Diterima', 'Ditolak', 'Dibatalkan', 'Wawancara', 'Dipekerjakan'])->default('Menunggu');
            $table->unsignedMediumInteger('salary_min')->nullable();
            $table->unsignedMediumInteger('salary_max')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('undangan_talent_pools');
    }
};
