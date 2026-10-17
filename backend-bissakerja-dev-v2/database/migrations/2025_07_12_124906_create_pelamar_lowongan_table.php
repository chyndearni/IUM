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
        Schema::create('pelamar_lowongan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('post_lowongan_id')->constrained('post_lowongan')->onDelete('cascade');
            $table->foreignId('disabilitas_id')->constrained('disabilitas')->onDelete('cascade');
            $table->date('tanggal_melamar')->default(now());
            $table->enum('status', ['baru', 'diterima', 'ditolak'])->default('baru');
            $table->softDeletes(); // akan menambahkan kolom deleted_at
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelamar_lowongan');
    }
};
