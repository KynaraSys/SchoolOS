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
        Schema::table('guardian_student', function (Blueprint $table) {
            $table->boolean('receives_whatsapp')->default(false)->after('receives_email');
            $table->boolean('receives_portal')->default(true)->after('receives_whatsapp');
            $table->boolean('receives_calls')->default(true)->after('receives_portal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guardian_student', function (Blueprint $table) {
            $table->dropColumn(['receives_whatsapp', 'receives_portal', 'receives_calls']);
        });
    }
};
