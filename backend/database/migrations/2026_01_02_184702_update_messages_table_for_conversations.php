<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Truncate to avoid foreign key issues during migration
        DB::table('messages')->truncate();

        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['recipient_id']);
            $table->dropColumn(['recipient_id', 'read_at']);

            $table->foreignId('conversation_id')->after('id')->constrained()->onDelete('cascade');
            $table->string('context_type')->nullable()->after('content');
            $table->unsignedBigInteger('context_id')->nullable()->after('context_type');
            $table->timestamp('edited_at')->nullable()->after('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['conversation_id']);
            $table->dropColumn(['conversation_id', 'context_type', 'context_id', 'edited_at']);

            $table->foreignId('recipient_id')->nullable()->constrained('users'); // Nullable for reverse compatibility
            $table->timestamp('read_at')->nullable();
        });
    }
};
