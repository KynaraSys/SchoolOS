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
        Schema::create('retention_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('target'); // Students, Guardians, etc.
            $table->string('action'); // Archive, Anonymize, Delete
            $table->json('rules'); // JSON array of rules
            $table->string('schedule'); // Cron expression
            $table->boolean('is_dry_run')->default(true);
            $table->string('status')->default('Active'); // Active, Paused
            $table->timestamp('last_run_at')->nullable();
            $table->string('last_run_status')->nullable();
            $table->timestamps();
        });

        Schema::create('retention_execution_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('retention_job_id')->constrained()->onDelete('cascade');
            $table->string('action');
            $table->integer('records_affected')->default(0);
            $table->boolean('is_dry_run');
            $table->string('initiated_by')->nullable();
            $table->string('status'); // Success, Failed
            $table->text('details')->nullable(); // JSON or text summary
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retention_execution_logs');
        Schema::dropIfExists('retention_jobs');
    }
};
