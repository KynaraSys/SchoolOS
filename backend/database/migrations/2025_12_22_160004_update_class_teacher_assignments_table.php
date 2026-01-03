<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('class_teacher_assignments', function (Blueprint $table) {
            // The column class_id exists. Add FK constraint.
            if (Schema::hasColumn('class_teacher_assignments', 'class_id')) {
                // It was defined as foreignId('class_id')->index();
                // We add constraint now.
                // Assuming classes table exists now.
                $table->foreign('class_id')->references('id')->on('classes')->name('cta_class_id_foreign')->cascadeOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('class_teacher_assignments', function (Blueprint $table) {
            try {
                $table->dropForeign('cta_class_id_foreign');
            } catch (\Exception $e) {
                // Ignore
            }
        });
    }
};
