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
        Schema::create('post_lowongan_disabilitas', function (Blueprint $table) {
            $table->foreignId('post_lowongan_id')->constrained('post_lowongan')->onDelete('cascade');
            $table->foreignId('disabilitas_id')->constrained('disabilitas')->onDelete('cascade');
            $table->primary(['post_lowongan_id', 'disabilitas_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_lowongan_disabilitas');
    }
};
