<?php

use App\Services\GradingService;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$service = new GradingService();

echo "Verifying Grading Service Logic...\n\n";

// Test 1: Hybrid Calculation
$score = 95;
$res = $service->calculateHybrid($score);
echo "Score $score -> " . ($res ? $res->indicator : 'NULL') . " (Expected: EE1)\n";

$score = 50;
$res = $service->calculateHybrid($score);
echo "Score $score -> " . ($res ? $res->indicator : 'NULL') . " (Expected: ME2)\n";

$score = 15;
$res = $service->calculateHybrid($score);
echo "Score $score -> " . ($res ? $res->indicator : 'NULL') . " (Expected: BE1)\n";

// Test 2: Pure Resolution
$indicator = 'EE';
$res = $service->resolvePure($indicator);
echo "Indicator $indicator -> " . ($res ? $res->descriptor : 'NULL') . "\n";

echo "\nVerification Complete.\n";
