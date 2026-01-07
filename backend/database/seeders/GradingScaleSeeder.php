<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GradingScaleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Pure CBE Levels (Observation/Project based)
        $pureLevels = [
            ['indicator' => 'EE', 'descriptor' => 'Exceeding Expectation', 'color_hex' => '#10B981', 'order_index' => 1],
            ['indicator' => 'ME', 'descriptor' => 'Meeting Expectation', 'color_hex' => '#3B82F6', 'order_index' => 2],
            ['indicator' => 'AE', 'descriptor' => 'Approaching Expectation', 'color_hex' => '#F59E0B', 'order_index' => 3],
            ['indicator' => 'BE', 'descriptor' => 'Below Expectation', 'color_hex' => '#EF4444', 'order_index' => 4],
        ];

        foreach ($pureLevels as $level) {
            DB::table('grading_scales')->updateOrInsert(
                ['indicator' => $level['indicator'], 'type' => 'pure'],
                array_merge($level, ['created_at' => now(), 'updated_at' => now()])
            );
        }

        // 2. Hybrid Levels (Score Conversion)
        // Score Range	Indicator
        // 90–100	EE1
        // 75–89	EE2
        // 58–74	ME1
        // 41–57	ME2
        // 31–40	AE1
        // 21–30	AE2
        // 11–20	BE1
        // 01–10	BE2
        $hybridLevels = [
            ['indicator' => 'EE1', 'descriptor' => 'Exceeding Expectation (High)', 'min_score' => 90, 'max_score' => 100, 'color_hex' => '#047857', 'order_index' => 1],
            ['indicator' => 'EE2', 'descriptor' => 'Exceeding Expectation (Low)', 'min_score' => 75, 'max_score' => 89, 'color_hex' => '#10B981', 'order_index' => 2],
            ['indicator' => 'ME1', 'descriptor' => 'Meeting Expectation (High)', 'min_score' => 58, 'max_score' => 74, 'color_hex' => '#2563EB', 'order_index' => 3],
            ['indicator' => 'ME2', 'descriptor' => 'Meeting Expectation (Low)', 'min_score' => 41, 'max_score' => 57, 'color_hex' => '#3B82F6', 'order_index' => 4],
            ['indicator' => 'AE1', 'descriptor' => 'Approaching Expectation (High)', 'min_score' => 31, 'max_score' => 40, 'color_hex' => '#D97706', 'order_index' => 5],
            ['indicator' => 'AE2', 'descriptor' => 'Approaching Expectation (Low)', 'min_score' => 21, 'max_score' => 30, 'color_hex' => '#F59E0B', 'order_index' => 6],
            ['indicator' => 'BE1', 'descriptor' => 'Below Expectation (High)', 'min_score' => 11, 'max_score' => 20, 'color_hex' => '#DC2626', 'order_index' => 7],
            ['indicator' => 'BE2', 'descriptor' => 'Below Expectation (Low)', 'min_score' => 0, 'max_score' => 10, 'color_hex' => '#EF4444', 'order_index' => 8],
        ];

        foreach ($hybridLevels as $level) {
            DB::table('grading_scales')->updateOrInsert(
                ['indicator' => $level['indicator'], 'type' => 'hybrid'],
                array_merge($level, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}
