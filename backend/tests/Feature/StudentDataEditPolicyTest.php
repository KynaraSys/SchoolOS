<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Activitylog\Models\Activity;

class StudentDataEditPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $teacher;
    protected $student;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Clear cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Admin User
        $this->admin = User::factory()->create();
        $role = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $this->admin->assignRole('Admin');

        // Teacher User
        $this->teacher = User::factory()->create();
        $roleTeacher = Role::firstOrCreate(['name' => 'Teacher', 'guard_name' => 'web']);
        $this->teacher->assignRole('Teacher');

        // Student
        $this->student = Student::create([
            'first_name' => 'Original',
            'last_name' => 'Name',
             // Ensure mandatory fields
            'admission_number' => '12345',
            'class_id' => SchoolClass::factory()->create()->id, 
            'gender' => 'Male',
        ]);
    }

    /** @test */
    public function admin_can_update_identity_with_reason()
    {
        $response = $this->actingAs($this->admin)
            ->patchJson("/api/students/{$this->student->id}/identity", [
                'first_name' => 'Corrected',
                'reason' => 'Spelling error corrected'
            ]);

        $response->assertStatus(200);
        $this->assertEquals('Corrected', $this->student->fresh()->first_name);

        // Verify Log
        $this->assertDatabaseHas('activity_log', [
            'subject_id' => $this->student->id,
            'description' => 'Updated student identity',
        ]);
        
        $log = Activity::where('description', 'Updated student identity')->latest()->first();
        $this->assertEquals('Spelling error corrected', $log->properties['reason']);
    }

    /** @test */
    public function identity_update_requires_reason()
    {
        $response = $this->actingAs($this->admin)
            ->patchJson("/api/students/{$this->student->id}/identity", [
                'first_name' => 'NewName',
                // No reason
            ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['reason']);
    }

    /** @test */
    public function teacher_cannot_update_identity()
    {
        $response = $this->actingAs($this->teacher)
            ->patchJson("/api/students/{$this->student->id}/identity", [
                'first_name' => 'Hacker',
                'reason' => 'Valid reason'
            ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function restricted_profile_update_via_learner_profile_service_is_blocked()
    {
        // OLD service should not update restricted fields
        // We will call the controller endpoint for profile update
        
        $response = $this->actingAs($this->teacher)
            ->postJson("/api/learners/{$this->student->id}/profile", [
                'upi' => 'NEW-UPI-123',
                'strengths' => 'Good at Math'
            ]);

        // It might be 200 OK because we only removed the logic, but the data shouldn't change
        $response->assertStatus(200);
        
        $this->assertNull($this->student->fresh()->upi); // Should not have changed/set
        $this->assertEquals('Good at Math', $this->student->profile->strengths);
    }
}
