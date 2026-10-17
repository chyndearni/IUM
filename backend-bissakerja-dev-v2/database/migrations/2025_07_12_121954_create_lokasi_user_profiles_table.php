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
        Schema::create('lokasi_user_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('kode_pos_ktp');
            $table->string('alamat_lengkap_ktp');

            $table->char('province_ktp_id', 2);
            $table->char('regencie_ktp_id', 4);
            $table->char('district_ktp_id', 7);
            $table->char('village_ktp_id', 10);

            $table->foreign('province_ktp_id')->references('id')->on('provinces')->onDelete('cascade');
            $table->foreign('regencie_ktp_id')->references('id')->on('regencies')->onDelete('cascade');
            $table->foreign('district_ktp_id')->references('id')->on('districts')->onDelete('cascade');
            $table->foreign('village_ktp_id')->references('id')->on('villages')->onDelete('cascade');

            $table->string('kode_pos_domisili');
            $table->string('alamat_lengkap_domisili');

            $table->char('province_domisili_id', 2);
            $table->char('regencie_domisili_id', 4);
            $table->char('district_domisili_id', 7);
            $table->char('village_domisili_id', 10);

            $table->foreign('province_domisili_id')->references('id')->on('provinces')->onDelete('cascade');
            $table->foreign('regencie_domisili_id')->references('id')->on('regencies')->onDelete('cascade');
            $table->foreign('district_domisili_id')->references('id')->on('districts')->onDelete('cascade');
            $table->foreign('village_domisili_id')->references('id')->on('villages')->onDelete('cascade');

            $table->foreignId('user_profile_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lokasi_ktps');
    }
};
