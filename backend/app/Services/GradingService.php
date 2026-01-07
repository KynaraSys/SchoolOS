<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class GradingService
{
    /**
     * Resolve a Hybrid Score to an Indicator (e.g., 85 -> EE2).
     *
     * @param float $score
     * @return object|null
     */
    public function calculateHybrid(float $score)
    {
        // Get all hybrid scales, cached for performance
        $scales = Cache::remember('grading_scales_hybrid', 3600, function () {
            return DB::table('grading_scales')
                ->where('type', 'hybrid')
                ->orderBy('min_score', 'desc')
                ->get();
        });

        foreach ($scales as $scale) {
            if ($score >= $scale->min_score && $score <= $scale->max_score) {
                return $scale;
            }
        }

        return null; // Should not happen if scales cover 0-100
    }

    /**
     * Resolve a Pure CBE Indicator (e.g., "EE" -> Object).
     *
     * @param string $indicator
     * @return object|null
     */
    public function resolvePure(string $indicator)
    {
        return Cache::remember("grading_scale_pure_{$indicator}", 3600, function () use ($indicator) {
            return DB::table('grading_scales')
                ->where('type', 'pure')
                ->where('indicator', $indicator)
                ->first();
        });
    }

    /**
     * Return all available options for a given type.
     */
    public function getScales(string $type)
    {
        return Cache::remember("grading_scales_list_{$type}", 3600, function () use ($type) {
            return DB::table('grading_scales')
                ->where('type', $type)
                ->orderBy('order_index')
                ->get();
        });
    }
}
