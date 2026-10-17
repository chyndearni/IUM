<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_lowongan', function (Blueprint $table) {
            $table->id();
            $table->string('job_title');
            $table->string('job_type');
            $table->text('description')->nullable();
            $table->text('responsibilities')->nullable();
            $table->text('requirements')->nullable();
            $table->string('education')->nullable();
            $table->string('experience')->nullable();
            $table->string('salary_range')->nullable();
            $table->text('benefits')->nullable();
            $table->string('location')->nullable();
            $table->date('application_deadline')->nullable();
            $table->text('accessibility_features')->nullable();
            $table->text('work_accommodations')->nullable();
            $table->json('skills')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('perusahaan_profile_id')->constrained('perusahaan_profiles')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_lowongan');
    }
};
