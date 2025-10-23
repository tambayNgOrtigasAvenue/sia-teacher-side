<?php

session_start();

require_once __DIR__ . '/../../config/cors.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

$_SESSION = array();

if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

session_destroy();
error_log('Session destroyed');

http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
?>