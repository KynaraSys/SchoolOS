<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Guardian;
use App\Models\Payment;
use App\Models\Attendance;
use App\Models\SchoolClass;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Carbon\Carbon;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cleanup existing 'no-user' students to prevent duplicates during re-seeds/fixes
        Student::whereNull('user_id')->delete();

        $faker = Faker::create();
        
        $firstNames = ['Kevin', 'Brian', 'John', 'Samuel', 'Ian', 'Dennis', 'Peter', 'Joseph', 'Kelvin', 'Maxwell', 
                       'Mercy', 'Faith', 'Esther', 'Mary', 'Caroline', 'Wanjiku', 'Sharon', 'Grace', 'Joy', 'Purity'];
                       
        $middleNames = ['Kamau', 'Njoroge', 'Mwangi', 'Odhiambo', 'Ochieng', 'Otieno', 'Kariuki', 'Kimani', 'Maina', 'Kipkorir',
                        'Wanjiru', 'Wambui', 'Njeri', 'Atieno', 'Achieng', 'Chebet', 'Jepkorir', 'Nyambura', 'Muthoni', 'Wangari'];
                        
        $surnames = ['Ouma', 'Onyango', 'Mutua', 'Mutiso', 'Kibet', 'Kiptoo', 'Korir', 'Ndegwa', 'Githegi', 'Omondi',
                     'Owino', 'Ngugi', 'Macharia', 'Chege', 'Rotich', 'Langat', 'Koech', 'Wafula', 'Simiyu', 'Nyongesa'];

        // Get available class IDs
        $classIds = SchoolClass::pluck('id')->toArray();
        if (empty($classIds)) {
            $this->command->error('No classes found. Please seed classes first.');
            return;
        }

        $this->command->info('Seeding 40 students without user accounts...');

        for ($i = 0; $i < 40; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $middleName = $middleNames[array_rand($middleNames)];
            $surname = $surnames[array_rand($surnames)];
            
            // Student Email (fake, for record only)
            $emailName = strtolower($firstName . '.' . $middleName . rand(100, 999));
            $parentEmail = $emailName . '.parent@gmail.com';

            // Pick a random class
            $classId = $classIds[array_rand($classIds)];

            // 1. Create Student (No User ID)
            $student = Student::create([
                'user_id' => null, // Explicitly null
                'first_name' => $firstName,
                'last_name' => $surname,
                'other_names' => $middleName,
                'admission_number' => date('Y') . '/' . str_pad(rand(10000, 99999), 5, '0', STR_PAD_LEFT),
                'parent_email' => $parentEmail,
                'class_id' => $classId, 
                'gender' => $i % 2 == 0 ? 'Male' : 'Female',
                'dob' => $faker->dateTimeBetween('-18 years', '-4 years'),
                'address' => $faker->address,
            ]);

            // 2. Create and Link Guardian (Parent)
            $guardianFirstName = $faker->firstName;
            $guardianLastName = $surname; 
            
            $gUser = User::firstOrCreate(
                ['email' => $parentEmail],
                [
                    'name' => "$guardianFirstName $guardianLastName",
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'is_active' => true,
                    'phone' => $faker->phoneNumber,
                ]
            );
            $gUser->assignRole('Parent');

            $guardian = Guardian::firstOrCreate(
                ['email' => $parentEmail],
                [
                    'user_id' => $gUser->id,
                    'first_name' => $guardianFirstName,
                    'last_name' => $guardianLastName,
                    'phone_number' => $gUser->phone,
                    'national_id' => $faker->unique()->numerify('########'),
                    'relationship_type' => 'Parent',
                    'occupation' => $faker->jobTitle,
                    'address' => $faker->address,
                    'is_active' => true,
                ]
            );

            // Link
            $student->guardians()->syncWithoutDetaching([
                $guardian->id => [
                    'is_primary' => true,
                    'receives_sms' => true,
                    'receives_email' => true,
                    'receives_portal' => true,
                ]
            ]);

            // 3. Financial Data (Payments)
            $paymentCount = rand(3, 8);
            for ($j = 0; $j < $paymentCount; $j++) {
                Payment::create([
                    'student_id' => $student->id,
                    'amount' => rand(500, 15000),
                    'payment_date' => $faker->dateTimeBetween('-3 months', 'now'),
                    'type' => $faker->randomElement(['Tuition', 'Transport', 'Lunch', 'Activity']),
                    'method' => $faker->randomElement(['M-Pesa', 'Bank Transfer', 'Cash']),
                    'transaction_reference' => strtoupper($faker->bothify('??##########')),
                    'description' => $faker->sentence(3),
                ]);
            }

            // 4. Attendance Data
            $startDate = Carbon::now()->subDays(30);
            for ($d = 0; $d < 30; $d++) {
                $date = $startDate->copy()->addDays($d);
                if ($date->isWeekend()) continue;

                // 90% chance present
                $status = 'present';
                $rand = rand(1, 100);
                if ($rand > 90) $status = 'absent';
                elseif ($rand > 85) $status = 'late';

                Attendance::create([
                    'student_id' => $student->id,
                    'class_id' => $classId, // Uses the assigned class
                    'date' => $date->toDateString(),
                    'status' => $status,
                    'marked_by' => 1, 
                    'marked_at' => $date->setTime(8, 0),
                    'remarks' => $status !== 'Present' ? $faker->sentence(3) : null,
                ]);
            }
        }
        
        $this->command->info('Seeding complete.');
    }
}
