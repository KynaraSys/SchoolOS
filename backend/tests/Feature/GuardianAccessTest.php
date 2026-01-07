<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Guardian;
use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\TeacherSubject; // Assuming this model exists for subject assignment
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

class GuardianAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create critical roles
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'Teacher']);
    }

    public function test_admin_can_view_all_guardians()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $guardian = Guardian::factory()->create();

        $response = $this->actingAs($admin)->getJson('/api/guardians');

        $response->assertStatus(200);
    }

    public function test_teacher_cannot_view_guardian_directory()
    {
        $teacher = User::factory()->create();
        $teacher->assignRole('Teacher');

        $response = $this->actingAs($teacher)->getJson('/api/guardians');

        $response->assertStatus(403); // Policy viewAny denied
    }

    public function test_class_teacher_can_view_own_student_guardian_with_masked_phone()
    {
        $teacher = User::factory()->create();
        $teacher->assignRole('Teacher');
        
        $class = SchoolClass::factory()->create();
        
        // Assign teacher to class (pivot table usually)
        DB::table('class_teacher_assignments')->insert([
            'user_id' => $teacher->id,
            'class_id' => $class->id,
            'academic_year' => '2025' // mock year
        ]);

        $student = Student::factory()->create(['class_id' => $class->id]);
        $guardian = Guardian::factory()->create(['phone_number' => '0712345678', 'national_id' => '12345678']);
        $student->guardians()->attach($guardian);

        $response = $this->actingAs($teacher)->getJson("/api/guardians/{$guardian->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('phone_number', '******5678') // Check masking
                 ->assertJsonMissing(['national_id', 'address', 'financial_summary']); // Check filtering
    }

    public function test_subject_teacher_can_view_names_only_no_phone()
    {
        $teacher = User::factory()->create();
        $teacher->assignRole('Teacher');
        
        $class = SchoolClass::factory()->create();
        
        // Assign subject teacher
        // Assuming TeacherSubject model or DB insert
        // DB::table('teacher_subjects')->insert([...]); 
        // Or if helper `teachesClass` logic relies on it.
        // For simplicity, let's mock the helper or ensure DB state matches `teachesClass` logic.
        
        // Let's rely on standard logic: TeacherSubject needs to exist.
        // Assuming 'teacher_subjects' table
         DB::table('teacher_subjects')->insert([
            'user_id' => $teacher->id,
            'class_id' => $class->id,
            'subject_id' => 1, // mock subject ID
        ]);

        $student = Student::factory()->create(['class_id' => $class->id]);
        $guardian = Guardian::factory()->create(['phone_number' => '0712345678', 'first_name' => 'John']);
        $student->guardians()->attach($guardian);

        $response = $this->actingAs($teacher)->getJson("/api/guardians/{$guardian->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('first_name', 'John')
                 ->assertJsonMissing(['phone_number', 'phone']) // Completely hidden
                 ->assertJsonMissing(['national_id']);
    }

    public function test_unrelated_teacher_cannot_view_guardian()
    {
        $teacher = User::factory()->create();
        $teacher->assignRole('Teacher');
        
        $otherClass = SchoolClass::factory()->create();
        $student = Student::factory()->create(['class_id' => $otherClass->id]);
        $guardian = Guardian::factory()->create();
        $student->guardians()->attach($guardian);

        $response = $this->actingAs($teacher)->getJson("/api/guardians/{$guardian->id}");

        $response->assertStatus(403);
    }
}
