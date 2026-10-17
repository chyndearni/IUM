<?php

use App\Enum\EducationLevel;
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
        Schema::create('pendidikans', function (Blueprint $table) {
            $table->id();
            $table->enum('tingkat', array_map(fn ($enum) => $enum->value, EducationLevel::cases()));
            $table->string('bidang_studi')->nullable();
            $table->string('nilai')->nullable();
            $table->date('tanggal_mulai');
            $table->date('tanggal_akhir');
            $table->string('lokasi')->nullable();
            $table->string('deskripsi')->nullable();
            $table->string('ijazah')->nullable();
            $table->foreignId('resume_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendidikans');
    }
};
