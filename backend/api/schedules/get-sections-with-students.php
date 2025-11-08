<?php
/**
 * API Endpoint: Get Sections with Student Count (for teaching schedule)
 * Method: GET
 * Returns sections grouped by grade with student enrollment counts
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
    // Get optional grade level filter
    $gradeLevelId = isset($_GET['gradeLevelId']) ? intval($_GET['gradeLevelId']) : null;
    
    // First check if the grade level exists
    if ($gradeLevelId) {
        $checkGrade = $db->prepare("SELECT GradeLevelID FROM gradelevel WHERE GradeLevelID = :id");
        $checkGrade->bindParam(':id', $gradeLevelId);
        $checkGrade->execute();
        
        if ($checkGrade->rowCount() === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Grade level not found.'
            ]);
            exit();
        }
    }
    
    $query = "
        SELECT 
            gl.GradeLevelID,
            gl.LevelName as gradeLevel,
            sec.SectionID,
            sec.SectionName,
            sec.MaxCapacity,
            sec.CurrentEnrollment,
            COALESCE(COUNT(DISTINCT e.EnrollmentID), 0) as studentCount,
            (sec.MaxCapacity - COALESCE(sec.CurrentEnrollment, 0)) as availableSlots,
            CASE 
                WHEN COALESCE(sec.CurrentEnrollment, 0) >= sec.MaxCapacity THEN 'Full'
                WHEN COALESCE(sec.CurrentEnrollment, 0) >= sec.MaxCapacity * 0.8 THEN 'Almost Full'
                ELSE 'Available'
            END as status
        FROM section sec
        JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
        LEFT JOIN enrollment e ON sec.SectionID = e.SectionID
        " . ($gradeLevelId ? "WHERE gl.GradeLevelID = :gradeLevelId" : "") . "
        GROUP BY sec.SectionID, gl.GradeLevelID, gl.LevelName, sec.SectionName, sec.MaxCapacity, sec.CurrentEnrollment
        ORDER BY gl.SortOrder, sec.SectionName
    ";
    
    $stmt = $db->prepare($query);
    if ($gradeLevelId) {
        $stmt->bindParam(':gradeLevelId', $gradeLevelId, PDO::PARAM_INT);
    }
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Group by grade level
    $sections = [];
    foreach ($results as $row) {
        $gradeKey = $row['GradeLevelID'];
        
        if (!isset($sections[$gradeKey])) {
            $sections[$gradeKey] = [
                'gradeLevelId' => $row['GradeLevelID'],
                'gradeLevel' => $row['gradeLevel'],
                'sections' => []
            ];
        }
        
        $sections[$gradeKey]['sections'][] = [
            'sectionId' => $row['SectionID'],
            'sectionName' => $row['SectionName'],
            'maxCapacity' => $row['MaxCapacity'],
            'studentCount' => (int)$row['studentCount'],
            'availableSlots' => (int)$row['availableSlots'],
            'status' => $row['status']
        ];
    }
    
    // Return success even if no sections found
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => array_values($sections),
        'debug' => [
            'gradeLevelId' => $gradeLevelId,
            'totalResults' => count($results),
            'groupedSections' => count($sections)
        ]
    ]);
    
} catch (Exception $e) {
    // Log the error
    error_log("Error in get-sections-with-students.php: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching sections: ' . $e->getMessage(),
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'gradeLevelId' => $gradeLevelId ?? null
        ]
    ]);
}
?>
