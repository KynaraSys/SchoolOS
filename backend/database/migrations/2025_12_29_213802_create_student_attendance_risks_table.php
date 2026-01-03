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
        Schema::create('student_attendance_risks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('term_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('risk_score')->default(0);
            $table->enum('risk_level', ['low', 'medium', 'high'])->default('low');
            $table->timestamp('last_evaluated_at')->useCurrent();
            $table->json('primary_factors')->nullable();
            $table->timestamps();
            
            $table->index(['student_id', 'term_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_attendance_risks');
    }
};
