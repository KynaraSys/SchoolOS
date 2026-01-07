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
            $table->string('birth_certificate_number')->nullable()->after('upi');
            $table->string('entry_level')->nullable()->comment('PP1, PP2, Grade 1, etc.')->after('class_id');
            $table->date('admission_date')->nullable()->after('entry_level');
            $table->string('admission_status')->default('Active')->comment('Active, Deferred, Withdrawn, Completed')->after('enrollment_status');
            $table->string('previous_school')->nullable()->after('admission_date');
            $table->text('medical_notes')->nullable()->after('special_needs');
            $table->text('accommodation_notes')->nullable()->comment('For SEN accommodations')->after('medical_notes');
            $table->string('pathway')->default('age_based')->comment('age_based, stage_based')->after('phase_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'birth_certificate_number',
                'entry_level',
                'admission_date',
                'admission_status',
                'previous_school',
                'medical_notes',
                'accommodation_notes',
                'pathway',
            ]);
        });
    }
};
