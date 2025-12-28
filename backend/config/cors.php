<?php
$allowed_origin = 'http://localhost:5177';

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $allowed_origin){
    header("Access-Control-Allow-Origin: " . $allowed_origin);
}
else{
    header("Access-Control-Allow-Origin: http://localhost:5177");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
else{
    error_log('CORS headers set for ' 
                . $_SERVER['REQUEST_METHOD']
                . ' request from ' 
                . ($_SERVER['HTTP_ORIGIN'] ?? 'unknown origin'));
}
?>