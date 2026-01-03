<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Run Roles and Permissions Seeder first
        $this->call([
            RolesAndPermissionsSeeder::class,
            StudentSeeder::class,
            IncidentSeeder::class,
        ]);

        // 2. Create Super Admin User (Vendor Level)
        $admin = User::firstOrCreate(
            ['email' => 'admin@school-os.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password123'), // Change this in production
                'email_verified_at' => now(),
                'is_super_admin' => true, // SET THE FLAG
            ]
        );

        // Assign 'Owner' or just leave without specific role if only flag matters. 
        // For UI labels, let's assign 'Owner' if they are the school owner, or no role if they are purely platform vendor.
        // Let's assume for this school instance, they are the Owner.
        $admin->assignRole('Owner');

        // 2b. Create School Admin (Standard Role-Based Admin)
        $schoolAdmin = User::firstOrCreate(
            ['email' => 'school_admin@school-os.com'],
            [
                'name' => 'School Admin',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'is_super_admin' => false,
            ]
        );
        $schoolAdmin->assignRole('Admin');

        // 3. Create a demo Teacher (Optional)
        $teacher = User::firstOrCreate(
            ['email' => 'teacher@school-os.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        $teacher->assignRole('Teacher');

        // 3a. Assign Class Teacher Responsibility (Form 3A - Mock ID 1)
        \App\Models\ClassTeacherAssignment::firstOrCreate(
            [
                'user_id' => $teacher->id,
                'class_id' => 1, // Mock Class ID
                'academic_year' => '2025'
            ],
            ['is_primary' => true]
        );

        // 3a. Create a Subject Teacher (No Class Assigned)
        $subjectTeacher = User::firstOrCreate(
            ['email' => 'subject_teacher@school-os.com'],
            [
                'name' => 'Sarah Science',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        $subjectTeacher->assignRole('Teacher');
        
        // 4. Create a demo Student (Optional)
        $student = User::firstOrCreate(
            ['email' => 'student@school-os.com'],
            [
                'name' => 'Jane Student',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        $student->assignRole('Student');
    }
}
