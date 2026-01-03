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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['direct', 'group'])->default('direct');
            $table->timestamps();
            $table->unique(['type']); // Only reasonable for basic unique checks but 'direct' isn't unique by itself.
            // Actually, uniqueness for 'direct' is complex (user A + user B). 
            // We'll handle that via query/participants logic, or a computed hash.
            // For now, no unique constraint on type alone.
        });
        
        // Remove the unique constraint line as it's invalid for this context
        Schema::table('conversations', function (Blueprint $table) {
             $table->dropUnique(['type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
