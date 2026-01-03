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
        $roleMap = [
            'owner' => 'Owner',
            'super_admin' => 'Super Admin',
            'ict_admin' => 'ICT Admin',
            'principal' => 'Principal',
            'academic_director' => 'Academic Director',
            'teacher' => 'Teacher',
            'bursar' => 'Bursar',
            'operations_manager' => 'Operations Manager',
            'discipline_master' => 'Discipline Master',
            'matron' => 'Matron',
            'parent' => 'Parent',
            'student' => 'Student',
            'admissions_officer' => 'Admissions Officer',
            'auditor' => 'Auditor',
            'admin' => 'Admin'
        ];

        foreach ($roleMap as $old => $new) {
            DB::table('roles')->where('name', $old)->update(['name' => $new]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $roleMap = [
            'Owner' => 'owner',
            'Super Admin' => 'super_admin',
            'ICT Admin' => 'ict_admin',
            'Principal' => 'principal',
            'Academic Director' => 'academic_director',
            'Teacher' => 'teacher',
            'Bursar' => 'bursar',
            'Operations Manager' => 'operations_manager',
            'Discipline Master' => 'discipline_master',
            'Matron' => 'matron',
            'Parent' => 'parent',
            'Student' => 'student',
            'Admissions Officer' => 'admissions_officer',
            'Auditor' => 'auditor',
            'Admin' => 'admin'
        ];

        foreach ($roleMap as $old => $new) {
            DB::table('roles')->where('name', $old)->update(['name' => $new]);
        }
    }
};
