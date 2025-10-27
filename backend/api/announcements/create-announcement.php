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
if (
    !empty($data->announcementId) &&
    !empty($data->authorId) &&
    !empty($data->title) &&
    !empty($data->content) &&
    !empty($data->publishDate) &&
    !empty($data->expiryDate) &&
    !empty($data->targetAudience) &&
    !empty($data->isPinned) &&
    !empty($data->isActive)
) {
    // Sanitize input
    $author_id = htmlspecialchars(strip_tags($data->authorId));
    $title = htmlspecialchars(strip_tags($data->title));
    $content = htmlspecialchars(strip_tags($data->content));
    $publish_date = htmlspecialchars(strip_tags($data->publishDate));
    $expiry_date = htmlspecialchars(strip_tags($data->expiryDate));
    $target_audience = htmlspecialchars(strip_tags($data->targetAudience));
    $is_pinned = htmlspecialchars(strip_tags($data->isPinned));
    $is_active = htmlspecialchars(strip_tags($data->isActive));
    // Prepare SQL query
    $query = "INSERT INTO announcement (author_id, title, content, publish_date, expiry_date, target_audience, is_pinned, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $db->prepare($query);

    // Execute query
    if ($stmt->execute([$author_id, $title, $content, $publish_date, $expiry_date, $target_audience, $is_pinned, $is_active])) {
        // Set response code - 201 created
        http_response_code(201);

        // Tell the user
        echo json_encode(array("message" => "Announcement was created."));
    } else {
        // Set response code - 503 service unavailable
        http_response_code(503);

        // Tell the user
        echo json_encode(array("message" => "Unable to create announcement."));
    }
} else {
    // Set response code - 400 bad request
    http_response_code(400);

    // Tell the user
    echo json_encode(array("message" => "Unable to create announcement. Data is incomplete."));
}