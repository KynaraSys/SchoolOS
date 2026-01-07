<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('competencies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('code')->nullable(); // e.g., COM-001
            $table->foreignId('subject_id')->nullable()->constrained()->nullOnDelete(); // Can be subject-specific or global
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('competencies');
    }
};
