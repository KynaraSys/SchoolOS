<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Migrate Super Admins to 'Admin' role
        // We use raw DB query to avoid Model scope issues if model changes
        $superAdminIds = \Illuminate\Support\Facades\DB::table('users')
                            ->where('is_super_admin', true)
                            ->pluck('id');

        // Ensure Admin role exists
        if (!Role::where('name', 'Admin')->exists()) {
             Role::create(['name' => 'Admin']);
        }

        $users = User::whereIn('id', $superAdminIds)->get();
        foreach ($users as $user) {
            $user->assignRole('Admin');
        }

        // 2. Drop the column
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_super_admin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_super_admin')->default(false)->after('password');
        });
    }
};
