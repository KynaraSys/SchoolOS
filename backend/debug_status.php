<?php

$url = 'http://localhost:3000/api/proxy/messages/unread-count';

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => "Accept: application/json\r\n",
        'follow_location' => 1,
        'ignore_errors' => true // Don't throw warning on 4xx/5xx
    ]
]);

$response = file_get_contents($url, false, $context);
$headers = $http_response_header;

echo "--- Response Headers ---\n";
foreach ($headers as $header) {
    echo $header . "\n";
}

echo "\n--- Response Body Start ---\n";
echo substr($response, 0, 200) . "...\n";
