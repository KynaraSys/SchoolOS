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
        Schema::create('guardians', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone_number')->unique()->index();
            $table->string('email')->nullable();
            $table->string('national_id')->nullable();
            // Relationship type (e.g., Father, Mother, Guardian) - can be nullable if not strictly required initially
            $table->string('relationship_type')->default('Guardian'); 
            $table->text('address')->nullable();
            $table->string('occupation')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guardians');
    }
};
