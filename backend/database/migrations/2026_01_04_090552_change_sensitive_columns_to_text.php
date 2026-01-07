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
            $table->text('parent_email')->nullable()->change();
            $table->text('address')->nullable()->change();
            $table->text('dob')->nullable()->change(); // Changed from DATE to TEXT
        });

        Schema::table('guardians', function (Blueprint $table) {
            $table->text('email')->nullable()->change();
            $table->text('phone_number')->nullable()->change();
            $table->text('national_id')->nullable()->change();
            $table->text('address')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('parent_email')->nullable()->change();
            $table->text('address')->nullable()->change(); // Was typically text/string
            $table->date('dob')->nullable()->change(); // Revert to DATE
        });

        Schema::table('guardians', function (Blueprint $table) {
            $table->string('email')->change();
            $table->string('phone_number')->change();
            $table->string('national_id')->change();
            $table->text('address')->change();
        });
    }
};
