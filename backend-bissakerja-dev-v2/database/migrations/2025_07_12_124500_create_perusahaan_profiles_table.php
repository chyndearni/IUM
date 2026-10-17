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
        Schema::create('perusahaan_profiles', function (Blueprint $table) {
            $table->id();
            // Informasi Dasar
            $table->string('logo')->nullable();
            $table->string('nama_perusahaan')->nullable();
            $table->string('industri')->nullable();
            $table->string('tahun_berdiri')->nullable();
            $table->string('jumlah_karyawan')->nullable();
            $table->char('province_id', 2)->nullable();
            $table->char('regencie_id', 4)->nullable();
            $table->longText('deskripsi')->nullable();
            // Informasi Kontak
            $table->string('no_telp')->nullable();
            $table->string('link_website')->nullable();
            $table->text('alamat_lengkap')->nullable();
            // Informasi Visi dan Misi
            $table->longText('visi')->nullable();
            $table->longText('misi')->nullable();
            // Informasi Nilai-Nilai Perusahaan dan Sertifikat
            $table->json('nilai_nilai')->nullable();
            $table->json('sertifikat')->nullable();

            $table->string('bukti_wajib_lapor')->nullable();
            $table->string('nib')->unique()->nullable();

            // Informasi Media Sosial
            $table->string('linkedin')->nullable();
            $table->string('instagram')->nullable();
            $table->string('facebook')->nullable();
            $table->string('twitter')->nullable();
            $table->string('youtube')->nullable();
            $table->string('tiktok')->nullable();

            $table->enum('status_verifikasi', ['belum', 'proses', 'terverifikasi'])->default('belum');

            $table->unsignedBigInteger('user_id');
            // $table->foreignId('industri_id')->constrained('industris')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('province_id')->references('id')->on('provinces')->cascadeOnDelete();
            $table->foreign('regencie_id')->references('id')->on('regencies')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perusahaan_profiles');
    }
};
