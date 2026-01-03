<?php
try {
    echo "--- START DEBUG ---\n";
    // Ensure we have a user
    $user = \App\Models\User::first(); 
    if (!$user) { echo "No users found\n"; exit; }
    echo "Logging in as User ID: " . $user->id . "\n";
    \Illuminate\Support\Facades\Auth::login($user);
    
    $controller = app(\App\Http\Controllers\IncidentController::class);
    $request = \Illuminate\Http\Request::create('/api/incidents', 'GET');
    
    echo "Calling index...\n";
    $response = $controller->index($request);
    
    echo "Response Class: " . get_class($response) . "\n";
    
    $content = $response->getContent(); // This calls json_encode internally for JsonResponse
    echo "Response Length: " . strlen($content) . "\n";
    
    // Explicitly test json_encode just in case
    if ($response instanceof \Illuminate\Http\JsonResponse) {
        $data = $response->getData();
        $encoded = json_encode($data);
        if ($encoded === false) {
             echo "JSON Encode Error: " . json_last_error_msg() . "\n";
        } else {
             echo "Explicit JSON Encode Success\n";
        }
    }

    echo "\n--- END DEBUG ---\n";
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "Trace:\n" . $e->getTraceAsString();
}
