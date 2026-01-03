<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            if (!Schema::hasColumn('incidents', 'assigned_to')) {
                $table->foreignId('assigned_to')->nullable()->constrained('users');
            }
            if (!Schema::hasColumn('incidents', 'closed_by')) {
                $table->foreignId('closed_by')->nullable()->constrained('users');
            }
            if (!Schema::hasColumn('incidents', 'closed_at')) {
                $table->timestamp('closed_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        // No down needed for a fix
    }
};
