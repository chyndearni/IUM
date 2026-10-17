<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // public function up(): void
    // {
    //     Schema::create('lokasi_domisilis', function (Blueprint $table) {
    //         $table->id();
    //         $table->string('kode_pos');
    //         $table->string('alamat_lengkap');

    //         $table->char('province_id', 2);
    //         $table->char('regencie_id', 4);
    //         $table->char('district_id', 7);
    //         $table->char('village_id', 10);

    //         $table->foreign('province_id')->references('id')->on('provinces')->onDelete('cascade');
    //         $table->foreign('regencie_id')->references('id')->on('regencies')->onDelete('cascade');
    //         $table->foreign('district_id')->references('id')->on('districts')->onDelete('cascade');
    //         $table->foreign('village_id')->references('id')->on('villages')->onDelete('cascade');
    //         $table->foreignId('user_profile_id')->constrained()->cascadeOnDelete();
    //         $table->timestamps();
    //         $table->softDeletes();
    //     });
    // }

    /**
     * Reverse the migrations.
     */
    // public function down(): void
    // {
    //     Schema::dropIfExists('lokasi_domisilis');
    // }
};
