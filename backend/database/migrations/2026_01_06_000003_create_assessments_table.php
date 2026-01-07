<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('competency_id')->nullable()->constrained()->nullOnDelete();
            
            $table->enum('assessment_type', ['pure_cbe', 'hybrid']);
            $table->enum('tool_type', ['observation', 'project', 'written_test', 'checklist']);
            
            // For Hybrid
            $table->decimal('raw_score', 5, 2)->nullable();
            
            // For Pure CBE (teacher selection) OR Hybrid (derived)
            $table->string('performance_level')->nullable(); // EE, ME, AE, BE, EE1, ME2 etc.
            
            $table->text('teacher_remarks')->nullable();
            $table->json('evidence_paths')->nullable(); // Array of file paths
            
            $table->timestamp('assessed_at');
            $table->foreignId('assessor_id')->constrained('users')->cascadeOnDelete();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
