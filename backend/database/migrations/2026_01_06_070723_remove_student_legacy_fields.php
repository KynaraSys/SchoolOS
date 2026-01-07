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
            // Ensure email is nullable if it isn't already (it was added as nullable in 2026_01_04_120001 but let's be safe)
            $table->string('email')->nullable()->change();
            
            // User ID should be nullable (done in 2026_01_02_100641 but confirming via change if needed, though change() on foreign key column can be tricky. 
            // If it's already nullable, this does nothing. If not, it makes it nullable.)
            // $table->foreignId('user_id')->nullable()->change(); // This often requires dropping FK first. 
            // Since we verified it's nullable in previous migrations, we'll skip forcing it here to avoid FK errors.
            
            // Remove any potential legacy columns if they existed (just in case they were added in ad-hoc migrations not seen)
            // $table->dropColumn(['kcpe_marks', 'kcpe_grade']); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Revert changes if needed
        });
    }
};
