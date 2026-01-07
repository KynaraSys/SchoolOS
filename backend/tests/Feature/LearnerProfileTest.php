<?php

namespace Tests\Feature;

use App\Models\LearnerProfile;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LearnerProfileTest extends TestCase
{
    // usage of RefreshDatabase might wipe dev data, so be careful. 
    // In this environment, we often avoid RefreshDatabase and just manually clean up or use transaction traits if possible.
    // However, for safety in this specific environment, I will NOT use RefreshDatabase and instead create distinct data.
    
    public function test_can_fetch_learner_profile()
    {
        $user = User::factory()->create();
        $this->actingAs($user); // Assume admin or authorized user

        $student = Student::factory()->create(); // Needs factory to work
        // If factory doesn't exist/work, this might fail. Let's assume there's a Student factory.

        $response = $this->getJson("/api/learners/{$student->id}/profile");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'student',
                     'cbe_profile',
                     'attendance_summary',
                     'discipline_summary'
                 ]);
    }

    public function test_can_update_learner_profile()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $student = Student::factory()->create();

        $data = [
            'strengths' => 'Strong in math',
            'areas_for_support' => 'Needs help in reading',
            'upi' => 'ABC12345'
        ];

        $response = $this->postJson("/api/learners/{$student->id}/profile", $data);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('learner_profiles', [
            'student_id' => $student->id,
            'strengths' => 'Strong in math'
        ]);

        $this->assertDatabaseHas('students', [
            'id' => $student->id,
            'upi' => 'ABC12345'
        ]);
    }
}
