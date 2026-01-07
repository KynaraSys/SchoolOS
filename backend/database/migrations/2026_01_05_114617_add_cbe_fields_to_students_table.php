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
        Schema::table('students', function (Blueprint $table) {
            $table->string('upi')->nullable()->unique()->after('admission_number');
            $table->foreignId('phase_id')->nullable()->after('class_id'); // Assuming phase_id refers to a phase lookup or table
            $table->string('enrollment_status')->default('active')->after('phase_id');
            $table->text('special_needs')->nullable()->after('enrollment_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['upi', 'phase_id', 'enrollment_status', 'special_needs']);
        });
    }
};
