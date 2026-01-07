<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Student;
use App\Models\SchoolClass;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class LearnerRetentionTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $student;

    protected function setUp(): void
    {
        parent::setUp();

        // Create Admin User
        $this->admin = User::factory()->create();
        $role = Role::firstOrCreate(['name' => 'Super Admin']);
        $this->admin->assignRole($role);

        // Create Permissions if they don't exist (mocking what seeder does)
        Permission::firstOrCreate(['name' => 'manage retention']);
        $role->givePermissionTo('manage retention');

        // Create a Student
        $this->student = Student::create([
            'user_id' => User::factory()->create()->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'other_names' => 'Kamau',
            'admission_number' => 'ADM001',
            'gender' => 'Male',
            'admission_status' => 'Admitted',
            'enrollment_status' => 'active'
        ]);
    }

    public function test_admin_can_archive_student()
    {
        $response = $this->actingAs($this->admin, 'sanctum')
                         ->postJson("/api/learners/{$this->student->id}/archive");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Student archived successfully.']);

        $this->student->refresh();
        $this->assertNotNull($this->student->archived_at);
        $this->assertEquals('archived', $this->student->enrollment_status);
        $this->assertEquals('archived', $this->student->retention_status);
    }

    public function test_admin_can_anonymize_student()
    {
        // Must be archived first usually, but our controller allows direct or sequential
        $this->student->archive();

        $response = $this->actingAs($this->admin, 'sanctum')
                         ->postJson("/api/learners/{$this->student->id}/anonymize");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Student records anonymized.']);

        $this->student->refresh();
        $this->assertNotNull($this->student->anonymized_at);
        $this->assertEquals('anonymized', $this->student->enrollment_status);
        $this->assertStringContainsString('Anonymized Student', $this->student->name);
    }

    public function test_admin_can_restore_student()
    {
        $this->student->archive();
        
        $response = $this->actingAs($this->admin, 'sanctum')
                         ->postJson("/api/learners/{$this->student->id}/restore");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Student record restored.']);

        $this->student->refresh();
        $this->assertNull($this->student->archived_at);
        $this->assertNull($this->student->anonymized_at);
        $this->assertEquals('active', $this->student->enrollment_status);
    }

    public function test_admin_can_soft_delete_student()
    {
        $response = $this->actingAs($this->admin, 'sanctum')
                         ->deleteJson("/api/learners/{$this->student->id}");

        $response->assertStatus(200);

        $this->assertSoftDeleted('students', ['id' => $this->student->id]);
    }

    public function test_unauthorized_user_cannot_archive()
    {
        $teacher = User::factory()->create();
        $role = Role::firstOrCreate(['name' => 'Teacher']);
        $teacher->assignRole($role);

        $response = $this->actingAs($teacher, 'sanctum')
                         ->postJson("/api/learners/{$this->student->id}/archive");

        $response->assertStatus(403);
    }
}
