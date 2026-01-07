<?php

namespace Database\Factories;

use App\Models\SchoolClass;
use Illuminate\Database\Eloquent\Factories\Factory;

class SchoolClassFactory extends Factory
{
    protected $model = SchoolClass::class;

    public function definition()
    {
        return [
            'name' => 'Grade ' . $this->faker->numberBetween(1, 12),
            'stream' => $this->faker->randomElement(['North', 'South', 'East', 'West', 'A', 'B']),
            'grade_level' => $this->faker->numberBetween(1, 12),
        ];
    }
}
