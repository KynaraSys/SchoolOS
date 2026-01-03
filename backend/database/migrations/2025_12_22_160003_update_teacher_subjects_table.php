<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('teacher_subjects', function (Blueprint $table) {
            // Add foreign keys only where safe, index them
            // The columns might already exist from previous migration but without FK constraints if they were created as integers or nullable
            // However, looking at previous migration, they were created as:
            // $table->foreignId('class_id')->nullable()->index();
            // $table->foreignId('subject_id')->nullable()->index();
            // $table->foreignId('term_id')->nullable()->index();
            // foreignId creates UNSIGNED BIGINT
            
            // We just need to add the constraints if they don't exist, or ensure they point to the new tables.
            // Since the tables didn't exist before, strict FKs might have failed if enforced immediately or if using SQLite with foreign keys enabled.
            // But Laravel migration order matters. Now that we created the tables, we can add constraints.
            
            // NOTE: SQLite doesn't support adding foreign key constraints to existing tables easily with Schema::table usually requires recreating table.
            // But Laravel handles some of this. If it fails on SQLite, we might need a more complex approach.
            // However, user asked for "Add foreign key constraints".
            
            // To be safe and idempotent:
            if (Schema::hasColumn('teacher_subjects', 'class_id')) {
                 $table->foreign('class_id')->references('id')->on('classes')->nullOnDelete();
            }
            if (Schema::hasColumn('teacher_subjects', 'subject_id')) {
                 $table->foreign('subject_id')->references('id')->on('subjects')->nullOnDelete();
            }
            if (Schema::hasColumn('teacher_subjects', 'term_id')) {
                 $table->foreign('term_id')->references('id')->on('terms')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('teacher_subjects', function (Blueprint $table) {
            // Drop foreign keys
            // Syntax: dropForeign(['column_name'])
            try {
                $table->dropForeign(['class_id']);
                $table->dropForeign(['subject_id']);
                $table->dropForeign(['term_id']);
            } catch (\Exception $e) {
                // Ignore if they don't exist
            }
        });
    }
};
