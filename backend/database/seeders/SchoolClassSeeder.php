<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SchoolClass;
use Illuminate\Support\Facades\DB;

class SchoolClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Optional: Clean up old "Stream A" classes if we want a clean slate
        // Since foreign key is nullOnDelete, this is safe and will just unassign students
        SchoolClass::where('stream', 'A')->delete(); 

        $forms = [1, 2, 3, 4];
        $streams = ['North', 'South', 'East', 'West'];

        foreach ($forms as $form) {
            foreach ($streams as $stream) {
                SchoolClass::firstOrCreate([
                    'name' => "Form $form",
                    'grade_level' => $form,
                    'stream' => $stream
                ]);
            }
        }
    }
}
