<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grading_scales', function (Blueprint $table) {
            $table->id();
            $table->string('indicator'); // EE, ME, EE1, ME2 etc.
            $table->string('descriptor'); // Exceeding Expectation
            $table->enum('type', ['pure', 'hybrid'])->index(); // pure: EE, ME... hybrid: EE1, EE2...
            $table->integer('min_score')->nullable(); // For hybrid conversion
            $table->integer('max_score')->nullable(); // For hybrid conversion
            $table->string('color_hex')->default('#000000');
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grading_scales');
    }
};
