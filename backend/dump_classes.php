<?php
use App\Models\SchoolClass;
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Dumping Classes:\n";
$classes = SchoolClass::all();
foreach ($classes as $c) {
    echo "ID: {$c->id}, Name: '{$c->name}', Stream: '{$c->stream}'\n";
}
