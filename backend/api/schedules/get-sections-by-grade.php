<?php
/**
 * API Endpoint: Get Sections by Grade Level
 * Method: GET
 * Returns sections for a specific grade level
 */

session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated.']);
    exit();
}

$gradeLevelId = $_GET['gradeLevelId'] ?? null;

if (!$gradeLevelId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Grade Level ID is required.']);
    exit();
}

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

try {
    // Get sections for the specified grade level
    $query = "
        SELECT 
            s.SectionID as id,
            s.SectionName as sectionName,
            CONCAT(p.FirstName, ' ', p.LastName) as advisorName,
            tp.TeacherProfileID as advisorId
        FROM section s
        LEFT JOIN teacherprofile tp ON s.AdviserTeacherID = tp.TeacherProfileID
        LEFT JOIN profile p ON tp.ProfileID = p.ProfileID
        JOIN schoolyear sy ON s.SchoolYearID = sy.SchoolYearID
        WHERE s.GradeLevelID = :gradeLevelId
            AND sy.IsActive = 1
        ORDER BY s.SectionName
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':gradeLevelId', $gradeLevelId, PDO::PARAM_INT);
    $stmt->execute();
    $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $sections
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching sections: ' . $e->getMessage()
    ]);
}
?>
