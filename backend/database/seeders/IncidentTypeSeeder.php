<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IncidentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'name' => 'Late Arrival',
                'severity' => 'low',
                'points' => 1,
                'description' => 'Arriving late to class or school without valid reason.',
                'active' => true,
            ],
            [
                'name' => 'Uniform Violation',
                'severity' => 'low',
                'points' => 1,
                'description' => 'Not wearing complete or correct school uniform.',
                'active' => true,
            ],
            [
                'name' => 'Disruptive Behavior',
                'severity' => 'medium',
                'points' => 2,
                'description' => 'Disturbing the learning environment.',
                'active' => true,
            ],
            [
                'name' => 'Incomplete Homework',
                'severity' => 'low',
                'points' => 1,
                'description' => 'Failure to submit assigned work.',
                'active' => true,
            ],
            [
                'name' => 'Bullying',
                'severity' => 'critical',
                'points' => 5,
                'description' => 'Physical or verbal harassment of other students.',
                'active' => true,
            ],
            [
                'name' => 'Fighting',
                'severity' => 'critical',
                'points' => 5,
                'description' => 'Physical altercation with another student.',
                'active' => true,
            ],
            [
                'name' => 'Vandalism',
                'severity' => 'high',
                'points' => 4,
                'description' => 'Damaging school property.',
                'active' => true,
            ],
        ];

        foreach ($types as $type) {
            \App\Models\IncidentType::create($type);
        }
    }
}
