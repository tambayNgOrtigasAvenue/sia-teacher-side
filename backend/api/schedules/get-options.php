<?php
/**
 * API Endpoint: Get Grade Levels and Subjects
 * Method: GET
 * Returns all grade levels and subjects for creating classes
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

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

try {
    // Get grade levels - ordered by SortOrder
    $gradeLevelsQuery = "SELECT GradeLevelID as id, LevelName as name FROM gradelevel ORDER BY SortOrder";
    $stmt = $db->prepare($gradeLevelsQuery);
    $stmt->execute();
    $gradeLevels = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get distinct subjects (since each subject can be for multiple grades)
    $subjectsQuery = "SELECT DISTINCT SubjectName as name, MIN(SubjectID) as id FROM subject WHERE IsActive = 1 GROUP BY SubjectName ORDER BY SubjectName";
    $stmt = $db->prepare($subjectsQuery);
    $stmt->execute();
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get active school year - using YearName column
    $schoolYearQuery = "SELECT SchoolYearID as id, YearName as label FROM schoolyear WHERE IsActive = 1 LIMIT 1";
    $stmt = $db->prepare($schoolYearQuery);
    $stmt->execute();
    $schoolYear = $stmt->fetch(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'gradeLevels' => $gradeLevels,
            'subjects' => $subjects,
            'activeSchoolYear' => $schoolYear
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching data: ' . $e->getMessage()
    ]);
}
?>
