<?php

namespace App\Services;

use App\Models\Staff;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class StaffService
{
    /**
     * Create a new staff member, optionally creating a user account.
     *
     * @param array $data Validated data from request
     * @return Staff
     */
    public function createStaff(array $data): Staff
    {
        return DB::transaction(function () use ($data) {
            $user = null;

            // 1. Create User if system access is required
            // Check if phone or email is provided and system access is requested (implied by presence of contact info or explicit flag if we had one)
            // But here we rely on 'create_user_account' boolean or just phone presence?
            // Let's assume input has 'create_user' flag or we infer it.
            // For this implementation, we will look for 'phone' as it's the primary login.
            
            if (!empty($data['phone'])) {
                $user = User::create([
                    'name' => $data['first_name'] . ' ' . $data['last_name'],
                    'email' => $data['email'] ?? null,
                    'phone' => $data['phone'],
                    'password' => Hash::make(Str::random(16)), // Staff never set password manually initially
                    'is_active' => $data['is_active'] ?? true,
                    'force_password_change' => true, // Force change on first login
                ]);

                // Assign Roles
                if (!empty($data['roles'])) {
                    $user->syncRoles($data['roles']);
                }
            }

            // 2. Create Staff Record
            $staff = Staff::create([
                'user_id' => $user?->id,
                'staff_number' => $data['staff_number'],
                'national_id_number' => $data['national_id_number'],
                'employment_type' => $data['employment_type'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'qualification' => $data['qualification'] ?? null,
                'tsc_number' => $data['tsc_number'] ?? null,
                'specialization' => $data['specialization'] ?? null,
            ]);

            Log::info("Staff created: {$staff->staff_number}", ['user_id' => $user?->id]);

            return $staff;
        });
    }

    /**
     * Update existing staff and user details.
     */
    public function updateStaff(Staff $staff, array $data): Staff
    {
        return DB::transaction(function () use ($staff, $data) {
            // Update Staff details
            $staff->update([
                'national_id_number' => $data['national_id_number'] ?? $staff->national_id_number,
                'employment_type' => $data['employment_type'] ?? $staff->employment_type,
                'start_date' => $data['start_date'] ?? $staff->start_date,
                'end_date' => $data['end_date'] ?? $staff->end_date,
                'qualification' => $data['qualification'] ?? $staff->qualification,
                'tsc_number' => $data['tsc_number'] ?? $staff->tsc_number,
                'specialization' => $data['specialization'] ?? $staff->specialization,
                'is_active' => $data['is_active'] ?? $staff->is_active,
            ]);

            // Update User details if exists or create if new
            if ($staff->user) {
                $staff->user->update([
                    'name' => ($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? '') ?: $staff->user->name,
                    'email' => $data['email'] ?? $staff->user->email,
                    'phone' => $data['phone'] ?? $staff->user->phone,
                    'is_active' => $data['is_active'] ?? $staff->user->is_active,
                ]);
                
                if (isset($data['roles'])) {
                    $staff->user->syncRoles($data['roles']);
                }
            } else if (!empty($data['phone'])) {
                // Attach new user if they didn't have one but now provided phone
                 $user = User::create([
                    'name' => $data['first_name'] . ' ' . $data['last_name'],
                    'email' => $data['email'] ?? null,
                    'phone' => $data['phone'],
                    'password' => Hash::make(Str::random(16)),
                    'is_active' => $data['is_active'] ?? true,
                    'force_password_change' => true,
                ]);
                
                $staff->user_id = $user->id;
                $staff->save();

                if (!empty($data['roles'])) {
                    $user->syncRoles($data['roles']);
                }
            }

            return $staff;
        });
    }
}
