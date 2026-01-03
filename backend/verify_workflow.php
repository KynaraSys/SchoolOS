<?php

use App\Models\User;
use App\Models\Incident;
use App\Services\IncidentService;
use App\Models\DisciplineEscalationRule;

// Ensure we have the service
$service = app(IncidentService::class);

echo "--- Starting Verification ---\n";

// 1. Setup Data
$teacher = User::factory()->create();
$teacher->assignRole('Teacher');

$principal = User::factory()->create();
$principal->assignRole('Principal');

// Ensure rules exist (seeded)
$rulesCount = DisciplineEscalationRule::count();
echo "Rules count: $rulesCount\n";

// 2. Create Incident (Low Severity)
echo "Creating Incident...\n";
$data = [
    'student_id' => 1, // Assume student 1 exists
    'title' => 'Test Incident',
    'severity' => 'low',
    'occurred_at' => now()->toDateString(),
    'status' => 'pending'
];

try {
    $incident = $service->createIncident($data, $teacher);
    echo "Incident Created. ID: {$incident->id}. Assigned To: " . ($incident->assigned_to ? 'User ' . $incident->assigned_to : 'None') . "\n";
    
    // 3. Update Status (Pending -> Under Review)
    // Should be allowed for assigned user (if teacher rule works) or Admin
    // Rules: Low -> Teacher. So assigned_to should be a teacher.
    // Wait, the seeder assigns 'Teacher' role. 'resolveAssignment' picks *a* user with that role.
    // It might pick the created $teacher or another.
    
    echo "Updating Status to Under Review...\n";
    $service->updateStatus($incident, 'under_review', $principal, "Reviewing this case.");
    echo "Status Updated to Under Review.\n";
    
    // 4. Update Status to Resolved (Missing Action Taken - Should Fail)
    echo "Attempting Resolve without Action Taken...\n";
    try {
        $service->updateStatus($incident, 'resolved', $principal, "Closing.");
        echo "FAILED: allowed resolve without action.\n";
    } catch (\Exception $e) {
        echo "PASSED: Caught expected error: " . $e->getMessage() . "\n";
    }
    
    // 5. Update Status to Resolved (Success)
    echo "Resolving with Action Taken...\n";
    $service->updateStatus($incident, 'resolved', $principal, "Closing.", "Suspension");
    echo "Incident Resolved.\n";
    
    // 6. Check Logs
    $logs = $incident->logs()->count();
    echo "Logs count: $logs (Expected at least 3: Create, Review, Resolve)\n";
    
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
