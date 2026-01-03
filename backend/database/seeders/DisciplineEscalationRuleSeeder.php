<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DisciplineEscalationRule;

class DisciplineEscalationRuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rules = [
            [
                'severity' => 'low',
                'role' => 'Teacher',
                'school_custom' => false,
            ],
            [
                'severity' => 'medium',
                'role' => 'Academic Director', // Acting as Discipline Master
                'school_custom' => false,
            ],
            [
                'severity' => 'high',
                'role' => 'Principal',
                'school_custom' => false,
            ],
            [
                'severity' => 'critical',
                'role' => 'Principal',
                'school_custom' => false,
            ],
        ];

        foreach ($rules as $rule) {
            DisciplineEscalationRule::firstOrCreate(
                ['severity' => $rule['severity'], 'school_custom' => $rule['school_custom']],
                ['role' => $rule['role']]
            );
        }
    }
}
