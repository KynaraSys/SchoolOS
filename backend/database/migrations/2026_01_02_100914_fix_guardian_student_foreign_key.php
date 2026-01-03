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
        // 1. Drop existing FK constraint (assuming standard naming or check actual name if fails)
        Schema::table('guardian_student', function (Blueprint $table) {
             // We need to drop the foreign key. The name is usually table_column_foreign.
             // guardian_student_student_id_foreign
             $table->dropForeign(['student_id']);
        });

        // 2. Migrate Data: Convert User IDs to Student IDs
        // Fetch all current records
        $records = \Illuminate\Support\Facades\DB::table('guardian_student')->get();
        
        foreach ($records as $record) {
            // Find the student profile for this user
            $student = \Illuminate\Support\Facades\DB::table('students')->where('user_id', $record->student_id)->first();
            
            if ($student) {
                // Update with Student ID
                \Illuminate\Support\Facades\DB::table('guardian_student')
                    ->where('id', $record->id)
                    ->update(['student_id' => $student->id]);
            } else {
                // If the user referenced is NOT a student (has no profile), this link is invalid for the new schema.
                // We should delete it.
                \Illuminate\Support\Facades\DB::table('guardian_student')->where('id', $record->id)->delete();
            }
        }

        // 3. Re-add FK constraint pointing to 'students' table
        Schema::table('guardian_student', function (Blueprint $table) {
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert is complex: Student ID -> User ID.
        Schema::table('guardian_student', function (Blueprint $table) {
            $table->dropForeign(['student_id']);
        });

         $records = \Illuminate\Support\Facades\DB::table('guardian_student')->get();
         foreach ($records as $record) {
             $student = \Illuminate\Support\Facades\DB::table('students')->find($record->student_id);
             if ($student && $student->user_id) {
                 \Illuminate\Support\Facades\DB::table('guardian_student')
                     ->where('id', $record->id)
                     ->update(['student_id' => $student->user_id]);
             } else {
                  // Cannot revert if student has no user_id (which is the new feature).
                  // For now, delete or keep as is (foreign key add will fail if we keep IDs that don't match users)
                  \Illuminate\Support\Facades\DB::table('guardian_student')->where('id', $record->id)->delete();
             }
         }

        Schema::table('guardian_student', function (Blueprint $table) {
             $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
