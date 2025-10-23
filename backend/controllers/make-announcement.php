<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/cors.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed.']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['title'], $data['content'], $data['target_audience'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid input.']);
    exit();
}

$title = $data['title'];
$content = $data['content'];
$publish_date = date('Y-m-d H:i:s');
$expiry_date = isset($data['expiry_date']) ? $data['expiry_date'] : null;
$target_audience = $data['target_audience'];
$is_pinned = isset($data['is_pinned']) ? (bool)$data['is_pinned'] : false;
$is_active = true;

$stmt = $conn->prepare("INSERT INTO announcement (title, content, publish_date, expiry_date, target_audience, is_pinned, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssi", $title, $content, $publish_date, $expiry_date, $target_audience, $is_pinned, $is_active);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['message' => 'Announcement created successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to create announcement.']);
}

$stmt->close();
$conn->close();