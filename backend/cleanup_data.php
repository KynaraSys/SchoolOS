<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Guardian;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CleanupDataSeeder extends Seeder
{
    public function run()
    {
        echo "Starting database cleanup...\n\n";

        // Delete all students
        echo "Deleting students...\n";
        $studentCount = Student::count();
        Student::query()->delete();
        echo "Deleted {$studentCount} students.\n\n";

        // Delete all guardians
        echo "Deleting guardians...\n";
        $guardianCount = Guardian::count();
        Guardian::query()->delete();
        echo "Deleted {$guardianCount} guardians.\n\n";

        // Delete teachers and principals (keep only ICT Admin)
        echo "Deleting teachers and principals...\n";
        $deletedUsers = User::whereHas('roles', function($query) {
            $query->whereIn('name', ['Teacher', 'Principal']);
        })->count();

        User::whereHas('roles', function($query) {
            $query->whereIn('name', ['Teacher', 'Principal']);
        })->delete();

        echo "Deleted {$deletedUsers} teacher/principal users.\n\n";

        // Show remaining users
        echo "Remaining users:\n";
        $remainingUsers = User::with('roles')->get();
        foreach ($remainingUsers as $user) {
            $roles = $user->roles->pluck('name')->implode(', ');
            echo "- {$user->name} ({$user->email}) - Roles: {$roles}\n";
        }

        echo "\nDatabase cleanup completed!\n";
    }
}

