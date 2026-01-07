<?php

namespace Tests\Feature;

use App\Models\Student;
use App\Models\User;
use App\Models\Term;
use App\Models\Remark;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

class RemarksSystemTest extends TestCase
{
    protected $student;
    protected $term;
    protected $teacher;
    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Setup data
        // Assuming factories exist
        $this->term = Term::firstOrCreate(['name' => 'Term 1 2026'], ['start_date' => now(), 'end_date' => now()->addMonths(3)]);
        $this->student = Student::factory()->create();
        
        $this->teacher = User::factory()->create();
        // Setup Role
        if(!Role::where('name', 'Teacher')->exists()) Role::create(['name' => 'Teacher', 'guard_name' => 'web']);
        $this->teacher->assignRole('Teacher');

        $this->admin = User::factory()->create();
        if(!Role::where('name', 'Admin')->exists()) Role::create(['name' => 'Admin', 'guard_name' => 'web']);
        $this->admin->assignRole('Admin');
    }

    public function test_teacher_can_create_formative_remark()
    {
        $this->actingAs($this->teacher);

        $response = $this->postJson("/api/learners/{$this->student->id}/remarks", [
            'term_id' => $this->term->id,
            'type' => 'formative',
            'remark_text' => 'Good progress in math.',
            'title' => 'Math Week 1'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('remarks', [
            'student_id' => $this->student->id,
            'remark_text' => 'Good progress in math.',
            'type' => 'formative'
        ]);
    }

    public function test_profile_remark_frequency_limit()
    {
        // Admin acts as Class Teacher for this test to bypass complex assignment setup
        $this->actingAs($this->admin);

        // Create first profile remark
        $this->postJson("/api/learners/{$this->student->id}/remarks", [
            'term_id' => $this->term->id,
            'type' => 'profile',
            'remark_text' => 'First remark.',
        ])->assertStatus(201);

        // Try create second profile remark for same term
        $response = $this->postJson("/api/learners/{$this->student->id}/remarks", [
            'term_id' => $this->term->id,
            'type' => 'profile',
            'remark_text' => 'Second remark.',
        ]);

        $response->assertStatus(403);
    }
}
