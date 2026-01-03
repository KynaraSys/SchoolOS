<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CommunicationLog;
use App\Models\Guardian;

class CommunicationLogSeeder extends Seeder
{
    public function run()
    {
        $guardians = Guardian::with('students')->get();

        foreach ($guardians as $guardian) {
            foreach ($guardian->students as $studentWrapper) {
                // SMS Log
                CommunicationLog::create([
                    'guardian_id' => $guardian->id,
                    'student_id' => $studentWrapper->student_id,
                    'type' => 'sms',
                    'message' => "Dear parent, fees balance for {$studentWrapper->student->user->name} is KES 50,000. Please pay to avoid disruption.",
                    'sent_at' => now()->subDays(rand(1, 30)),
                    'status' => 'sent'
                ]);

                // Email Log
                CommunicationLog::create([
                    'guardian_id' => $guardian->id,
                    'student_id' => $studentWrapper->student_id,
                    'type' => 'email',
                    'subject' => 'Term 3 Report Form',
                    'message' => "Please find attached the report form for {$studentWrapper->student->user->name}.",
                    'sent_at' => now()->subDays(rand(1, 60)),
                    'status' => 'sent'
                ]);
            }
        }
    }
}
