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
        Schema::create('remarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('author_id')->constrained('users');
            $table->foreignId('term_id')->constrained('terms');
            
            // type maps to the 'context' requirement: formative (assessment), profile, report
            $table->enum('type', ['formative', 'profile', 'report']); 
            
            // author_role: subject_teacher, class_teacher, head_teacher
            $table->string('author_role'); 
            
            $table->string('title')->nullable(); // For formative remak context e.g. "Math Week 3"
            $table->text('remark_text');
            
            // Status for approval workflows (Official Report remarks)
            $table->enum('status', ['draft', 'published', 'approved', 'rejected'])->default('draft');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remarks');
    }
};
