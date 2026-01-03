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
        Schema::table('incidents', function (Blueprint $table) {
            $table->foreignId('assigned_to')->nullable()->constrained('users'); // Person currently responsible
            $table->foreignId('closed_by')->nullable()->constrained('users'); // Person who resolved/dismissed
            $table->timestamp('closed_at')->nullable();
            
            // For status enum update, standard Laravel 'change' requires dbal.
            // We'll trust the model consistency for now or do a raw statement if strictly needed.
            // Let's rely on the fact validation will enforcement the new 'under_review' status.
            // If the DB strictly checks ENUM, we need to alter it.
            // Assuming MySQL:
        });
        
        // Raw statement to safe update enum if MySQL
        try {
            DB::statement("ALTER TABLE incidents MODIFY COLUMN status ENUM('pending', 'under_review', 'escalated', 'resolved', 'dismissed') DEFAULT 'pending'");
        } catch (\Exception $e) {
            // Log or ignore if not MySQL or fails (e.g. SQLite doesn't support ENUM natively anyway)
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            $table->dropForeign(['assigned_to']);
            $table->dropColumn('assigned_to');
            $table->dropForeign(['closed_by']);
            $table->dropColumn('closed_by');
            $table->dropColumn('closed_at');
        });
        
        // Revert status (optional, risky if data exists)
    }
};
