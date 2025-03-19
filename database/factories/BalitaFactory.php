<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Balita>
 */
class BalitaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => $this->faker->name,
            'tempat_lahir' => $this->faker->address(),
            'tgl_lahir' => $this->faker->date('Y-m-d'),
            'jenis_kelamin' => $this->faker->randomElements(['Laki-laki', 'Perempuan']),
            'orang_tua_id' => $this->faker->randomElement(['1', '2'])
        ];
    }
}
