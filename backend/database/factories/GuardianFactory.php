<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Guardian>
 */
class GuardianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'phone_number' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'national_id' => $this->faker->unique()->numerify('########'),
            'relationship_type' => $this->faker->randomElement(['Father', 'Mother', 'Uncle', 'Aunt', 'Grandparent']),
            'address' => $this->faker->address(),
            'occupation' => $this->faker->jobTitle(),
            'is_active' => true,
            'receives_sms' => true,
            'receives_email' => true,
            'receives_whatsapp' => false,
            'receives_portal' => true,
            'receives_calls' => true,
        ];
    }
}
