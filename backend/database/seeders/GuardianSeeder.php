<?php

namespace Database\Seeders;

use App\Models\Guardian;
use App\Models\User;
use Illuminate\Database\Seeder;

class GuardianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    {
        $faker = \Faker\Factory::create();

        // 1. Fetch existing 'Student' users
        $students = User::role('Student')->get();

        if ($students->isEmpty()) {
            $this->command->info('No students found. Please seed students first.');
            return;
        }

        // 2. Create Guardians with User Accounts
        $guardians = [];
        for ($i = 0; $i < 40; $i++) {
            $firstName = $faker->firstName;
            $lastName = $faker->lastName;
            $email = strtolower($firstName . '.' . $lastName . rand(1, 999) . '@parent.school.com');
            
            // Create User for Guardian
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => "$firstName $lastName",
                    'password' => \Illuminate\Support\Facades\Hash::make('password'),
                    'email_verified_at' => now(),
                    'is_active' => true,
                ]
            );
            $user->assignRole('Parent');

            // Create Guardian Profile
            $guardian = Guardian::firstOrCreate(
                ['email' => $email],
                [
                    'user_id' => $user->id,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'phone_number' => $faker->unique()->phoneNumber, // Ensure unique phone
                    'national_id' => $faker->unique()->numerify('########'),
                    'relationship_type' => $faker->randomElement(['Father', 'Mother', 'Guardian']),
                    'occupation' => $faker->jobTitle,
                    'address' => $faker->address,
                    'is_active' => true,
                    'receives_sms' => true,
                    'receives_email' => true,
                ]
            );

            $guardians[] = $guardian;
        }

        $allGuardians = collect($guardians);

        // 3. Link Guardians to Students
        foreach ($students as $student) {
            // Skip if already has guardians (to prevent duplicates on re-seed, 
            // though we might want to ensure coverage if some are missing, 
            // but for now let's assume if they have one, they are good)
            if ($student->guardians()->exists()) {
                continue;
            }

            // Assign Primary Guardian
            $primaryGuardian = $allGuardians->random();
            try {
                $student->guardians()->attach($primaryGuardian->id, [
                    'is_primary' => true,
                    'receives_sms' => true,
                    'receives_email' => true,
                    'receives_portal' => true,
                ]);
            } catch (\Exception $e) {
                // Ignore duplicate entry errors if they happen by chance
            }

            // 30% chance to assign a Secondary Guardian
            if (rand(1, 100) <= 30) {
                $secondaryGuardian = $allGuardians->where('id', '!=', $primaryGuardian->id)->random();
                try {
                    $student->guardians()->attach($secondaryGuardian->id, [
                        'is_primary' => false,
                        'receives_sms' => false, // Secondary usually doesn't get all alerts by default
                        'receives_email' => true,
                        'receives_portal' => true,
                    ]);
                } catch (\Exception $e) {
                     // Ignore duplicate entry errors
                }
            }
        }
    }
}
