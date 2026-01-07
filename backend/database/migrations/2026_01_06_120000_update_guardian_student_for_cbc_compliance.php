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
        Schema::table('guardian_student', function (Blueprint $table) {
            // 1. Drop the unique constraint that limits 1 guardian per student
            // The index name might be guardian_student_student_id_unique or similar.
            $table->dropUnique(['student_id']);

            // 2. Add composite unique constraint to prevent duplicate same-guardian-same-student links
            $table->unique(['guardian_id', 'student_id']);

            // 3. Add relationship_type column to the pivot table
            if (!Schema::hasColumn('guardian_student', 'relationship_type')) {
                $table->string('relationship_type')->nullable()->after('student_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guardian_student', function (Blueprint $table) {
            $table->dropColumn('relationship_type');
            $table->dropUnique(['guardian_id', 'student_id']);
            $table->unique(['student_id']);
        });
    }
};
