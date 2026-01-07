<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Conversation;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MessageIdCollisionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_id_lookup_avoids_collision_with_conversation_id()
    {
        // 1. Setup Roles
        Role::create(['name' => 'Teacher']);
        Role::create(['name' => 'Admin']);

        // 2. Create "Derrick" (Target User) with ID 1
        // We force ID 1 if possible, or just note his ID.
        // In a fresh test DB, first user is usually ID 1.
        $targetUser = User::factory()->create(['id' => 1, 'name' => 'Derrick']);
        $targetUser->assignRole('Admin');

        // 3. Create a restricted conversation with ID 1
        // This conversation belongs to OTHER people (not our test user)
        $confidenialUser1 = User::factory()->create();
        $confidenialUser2 = User::factory()->create();
        
        $restrictedConv = Conversation::create(['id' => 1, 'type' => 'group']);
        $restrictedConv->participants()->attach([$confidenialUser1->id, $confidenialUser2->id]);

        // 4. Create our Test User (Teacher)
        $me = User::factory()->create();
        $me->assignRole('Teacher');

        // 5. Attempt to fetch messages for "Derrick" (ID 1)
        // Without the fix, this might hit Conversation 1 and 403.
        // With the fix (?type=user), it should treat 1 as User ID.
        
        $response = $this->actingAs($me)->getJson("/api/messages/1?type=user");

        // 6. Assert
        // Should be 200 OK (empty list, as no chat exists yet between Me and Derrick)
        // NOT 403 Forbidden
        $response->assertStatus(200);
        $response->assertJson([]);
    }
}
