<?php
//API endpoint for creating announcements
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed.']);
    exit();
}

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input data
if (!empty($data->announcementId)) {
    // Sanitize input
    $announcement_id = htmlspecialchars(strip_tags($data->announcementId));

    // Prepare SQL query
    $query = "DELETE FROM announcement WHERE id = ?";

    $stmt = $db->prepare($query);

    // Execute query
    if ($stmt->execute([$announcement_id])) {
        // Set response code - 200 OK
        http_response_code(200);

        // Tell the user
        echo json_encode(array("message" => "Announcement was deleted."));
    } else {
        // Set response code - 503 service unavailable
        http_response_code(503);

        // Tell the user
        echo json_encode(array("message" => "Unable to delete announcement."));
    }
} else {
    // Set response code - 400 bad request
    http_response_code(400);

    // Tell the user
    echo json_encode(array("message" => "Invalid input."));
}