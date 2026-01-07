<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition()
    {
        return [
            'admission_number' => $this->faker->unique()->numberBetween(1000, 9999),
            'class_id' => SchoolClass::factory(),
            'user_id' => User::factory(), // optional if student has user account
            'dob' => $this->faker->date(),
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'enrollment_status' => 'active',
        ];
    }
}
