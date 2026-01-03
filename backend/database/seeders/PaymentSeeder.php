<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $students = Student::all();
        // Payment types: tuition, uniform, transport, lunch
        // Term Fee: 50,000

        foreach ($students as $student) {
            // 70% chance of having made a payment this term
            if (rand(1, 100) <= 70) {
                // Determine amount paid (partial or full)
                $amount = rand(10000, 50000);
                
                Payment::create([
                    'student_id' => $student->id,
                    'amount' => $amount,
                    'payment_date' => Carbon::today()->subDays(rand(0, 60)),
                    'type' => 'tuition',
                    'method' => ['mpesa', 'bank', 'cash'][rand(0, 2)],
                    'transaction_reference' => strtoupper(uniqid('TRX')),
                    'description' => 'Term 1 Tuition',
                ]);
            }
        }
    }
}
