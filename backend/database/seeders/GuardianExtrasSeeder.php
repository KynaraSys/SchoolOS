<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Guardian;
use App\Models\User;
use App\Models\GuardianNote;
use App\Models\GuardianDocument;
use Illuminate\Support\Facades\DB;

class GuardianExtrasSeeder extends Seeder
{
    public function run()
    {
        $admin = User::first();
        $guardians = Guardian::all();

        if ($guardians->isEmpty()) {
            $this->command->info('No guardians found. Skipping extras seeder.');
            return;
        }

        foreach ($guardians as $guardian) {
            // Seed Notes
            if ($guardian->notes()->count() == 0) {
                GuardianNote::create([
                    'guardian_id' => $guardian->id,
                    'user_id' => $admin ? $admin->id : 1,
                    'content' => 'This is a sample internal note for testing purposes.',
                ]);
                GuardianNote::create([
                    'guardian_id' => $guardian->id,
                    'user_id' => $admin ? $admin->id : 1,
                    'content' => 'Another note regarding payment schedule discussion.',
                ]);
            }

            // Seed Documents (Fake)
            if ($guardian->documents()->count() == 0) {
                // creating a dummy file record without actual file on disk, might break download but shows in UI
                GuardianDocument::create([
                    'guardian_id' => $guardian->id,
                    'title' => 'Sample Contract',
                    'file_path' => 'guardian_documents/sample.pdf',
                    'file_type' => 'pdf',
                    'file_size' => 1024,
                    'uploaded_by' => $admin ? $admin->id : 1,
                ]);
            }
        }
    }
}
