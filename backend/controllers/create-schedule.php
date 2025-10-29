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

if (!isset($data['subject'], $data['start_time'], $data['end_time'], $data['teacher_id'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid input.']);
    exit();
}

$subject = $data['subject'];
$start_time = $data['start_time'];
$end_time = $data['end_time'];
$teacher_id = $data['teacher_id'];

$stmt = $conn->prepare("INSERT INTO schedules (subject, start_time, end_time, teacher_id) VALUES (?, ?, ?, ?)");
$stmt->execute([$subject, $start_time, $end_time, $teacher_id]);

http_response_code(201);
echo json_encode(['message' => 'Schedule created successfully.']);
