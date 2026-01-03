<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            // Add nullable columns
            if (!Schema::hasColumn('grades', 'subject_id')) {
                $table->foreignId('subject_id')->nullable()->constrained('subjects')->nullOnDelete();
            }
            if (!Schema::hasColumn('grades', 'class_id')) {
                $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete();
            }
            if (!Schema::hasColumn('grades', 'term_id')) {
                $table->foreignId('term_id')->nullable()->constrained('terms')->nullOnDelete();
            }
            
            // DO NOT remove subject string column as per requirements
        });
    }

    public function down(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            $table->dropForeign(['subject_id']);
            $table->dropForeign(['class_id']);
            $table->dropForeign(['term_id']);
            
            $table->dropColumn(['subject_id', 'class_id', 'term_id']);
        });
    }
};
