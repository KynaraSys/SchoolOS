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
            // Drop the old composite unique index (guardian_id, student_id)
            // Laravel usually names it table_column_column_unique
            $table->dropUnique(['guardian_id', 'student_id']);

            // Add new unique index on student_id to enforce 1 guardian per student
            $table->unique('student_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guardian_student', function (Blueprint $table) {
            $table->dropUnique(['student_id']);
            $table->unique(['guardian_id', 'student_id']);
        });
    }
};
