<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/grades-controller.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed.']);
    exit();
}

// Get posted data
$data = json_decode(file_get_contents("php://input"));

$gradesController = new GradeController($db);
$result = $gradesController->insertOrUpdateStudentGrade($data->studentId, $data->subjectId, $data->quarter, $data->grade);

if ($result) {
    http_response_code(201);
    echo json_encode(['message' => 'Grade inserted/updated successfully.']);
} else {
    http_response_code(503);
    echo json_encode(['message' => 'Unable to insert/update grade.']);
}