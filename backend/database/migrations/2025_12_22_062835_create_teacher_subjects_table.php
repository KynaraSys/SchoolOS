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
        Schema::create('teacher_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Assuming classes and subjects tables exist or will be created. Using unsignedBigInteger for FKs.
            // If they are not standard FKs (e.g. mock data earlier), we'll assume they will be.
            // But based on "Subject Teaching Assignment" req, we'll make them FKs or integers.
            // Given "PostgreSQL (locally hosted)", robust FKs are better.
            // However, checking existing migrations would be safer.
            // For now, defined as unsignedBigInteger to be safe, nullable if referenced tables don't exist yet but likely they do.
            $table->foreignId('class_id')->nullable()->index(); // Link to a classes table
            $table->foreignId('subject_id')->nullable()->index(); // Link to a subjects table
            $table->foreignId('term_id')->nullable()->index(); // Link to a terms table
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_subjects');
    }
};
