<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Create Permissions (Canonical 25)
        $permissions = [
            // User Management (4)
            'manage_users',
            'view_users',
            'edit_users',
            'delete_users',
            
            // Staff Management (2) [NEW]
            'manage_staff',
            'view_staff',

            // Role Management (5)
            'create_roles',
            'view_roles',
            'edit_roles',
            'delete_roles',
            'manage_roles',

            // Academic (7)
            'view_reports',
            'edit_grades',
            'view_grades',
            'view_classes',
            'manage_classes',
            'view_subjects',
            'manage_subjects',

            // Finance (2)
            'access_finance',
            'manage_payments',

            // Logistics (1)
            'manage_transport',

            // System (1)
            'view_logs',

            // Guardians & Relationships (4)
            'manage_guardians',
            'view_linked_students',
            'view_student_fees',
            'view_student_discipline',

            // Communication (1)
            'receive_communication',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Define Roles (School Level Only)
        // Super Admin is NOT a role, it's a user flag.

        // Admin
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $admin->syncPermissions([
            'manage_users', 'edit_users', 'view_users', 'delete_users',
            'manage_staff', 'view_staff',
            'manage_roles', 'create_roles', 'edit_roles', 'view_roles',
            'manage_classes', 'manage_subjects', 'view_classes', 'view_subjects',
            'view_logs', 'manage_guardians', 'manage_transport'
        ]);

        // ICT Admin
        Role::firstOrCreate(['name' => 'ICT Admin'])->syncPermissions([
            'manage_users', 'edit_users', 'view_users',
            'manage_staff', 'view_staff',
            'manage_roles', 'view_roles', 'view_logs',
            'manage_classes', 'manage_subjects'
        ]);

        // Principal
        Role::firstOrCreate(['name' => 'Principal'])->syncPermissions([
            'view_users', 'view_reports', 'view_grades',
            'view_classes', 'view_subjects',
            'manage_classes', 'manage_subjects', 'view_logs'
        ]);

        // Academic Director
        Role::firstOrCreate(['name' => 'Academic Director'])->syncPermissions([
            'view_users', 'view_reports', 'view_grades',
            'view_classes', 'view_subjects',
            'manage_classes', 'manage_subjects'
        ]);

        // Teacher
        Role::firstOrCreate(['name' => 'Teacher'])->syncPermissions([
            'view_classes', 'view_subjects', 'view_grades',
            'edit_grades', 'view_reports', 'receive_communication'
        ]);

        // Bursar
        Role::firstOrCreate(['name' => 'Bursar'])->syncPermissions([
            'access_finance', 'manage_payments', 'view_users', 'view_student_fees'
        ]);

        // Admissions Officer
        Role::firstOrCreate(['name' => 'Admissions Officer'])->syncPermissions([
            'manage_guardians', 'view_users', 'view_linked_students'
        ]);

        // Operations Manager
        Role::firstOrCreate(['name' => 'Operations Manager'])->syncPermissions([
            'view_users', 'manage_transport'
        ]);

        // Discipline Master
        Role::firstOrCreate(['name' => 'Discipline Master'])->syncPermissions([
            'view_linked_students', 'view_student_discipline', 'view_reports', 'receive_communication'
        ]);

        // Matron
        Role::firstOrCreate(['name' => 'Matron'])->syncPermissions([
            'view_linked_students', 'view_student_discipline', 'receive_communication'
        ]);

        // Auditor (Strict Read-Only)
        Role::firstOrCreate(['name' => 'Auditor'])->syncPermissions([
            'view_users', 'view_reports', 'view_grades', 'view_student_fees', 'view_logs'
        ]);

        // Parent
        Role::firstOrCreate(['name' => 'Parent'])->syncPermissions([
            'view_grades', 'view_reports', 'view_linked_students',
            'view_student_fees', 'view_student_discipline', 'receive_communication'
        ]);

        // Student
        Role::firstOrCreate(['name' => 'Student'])->syncPermissions([
            'view_grades', 'receive_communication'
        ]);
        
        // Owner (Optional placeholder if needed in UI, usually implies Super Admin flag but can be a role for labeling)
        Role::firstOrCreate(['name' => 'Owner'])->syncPermissions([
            'view_users', 'view_logs', 'view_reports' // Minimal, as real power is the flag
        ]);

        // Cleanup: If 'Super Admin' role exists from previous seeds, remove it to avoid confusion
        if (Role::where('name', 'Super Admin')->exists()) {
             Role::where('name', 'Super Admin')->delete();
        }
    }
}
