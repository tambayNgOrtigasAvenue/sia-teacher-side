<?php
/**
 * API Endpoint: Auto-create Sections for Grade Level
 * Method: POST
 * Creates 5 sections with flower names for a grade level
 * Flower names: Rose, Lily, Tulip, Daisy, Sunflower
 */

session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['gradeLevelId']) || empty($input['schoolYearId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Grade Level ID and School Year ID are required.']);
    exit();
}

try {
    $db->beginTransaction();
    
    $gradeLevelId = $input['gradeLevelId'];
    $schoolYearId = $input['schoolYearId'];
    $maxCapacity = 15; // Fixed capacity per section
    
    // Section names based on grade level theme
    $sectionThemes = [
        1 => ['Rose', 'Lily', 'Tulip', 'Daisy', 'Sunflower'], // Flowers
        2 => ['Tarsier', 'Carabao', 'Tamaraw', 'Philippine Eagle', 'Pawikan'], // Philippine Animals
        3 => ['Rizal', 'Bonifacio', 'Mabini', 'Del Pilar', 'Luna'], // Philippine National Heroes
        4 => ['Granite', 'Marble', 'Limestone', 'Sandstone', 'Basalt'], // Rocks and Stones
        5 => ['Cumulus', 'Stratus', 'Cirrus', 'Nimbus', 'Altostratus'], // Different Clouds
        6 => ['Oxygen', 'Hydrogen', 'Carbon', 'Nitrogen', 'Helium'] // Elements in Periodic Table
    ];
    
    // Get section names for this grade level, default to flowers if grade > 6
    $sectionNames = isset($sectionThemes[$gradeLevelId]) ? $sectionThemes[$gradeLevelId] : $sectionThemes[1];
    
    $createdSections = [];
    
    foreach ($sectionNames as $sectionName) {
        // Check if section already exists
        $checkQuery = "
            SELECT SectionID FROM section 
            WHERE SectionName = :sectionName 
            AND GradeLevelID = :gradeLevelId 
            AND SchoolYearID = :schoolYearId
            LIMIT 1
        ";
        
        $stmt = $db->prepare($checkQuery);
        $stmt->bindParam(':sectionName', $sectionName);
        $stmt->bindParam(':gradeLevelId', $gradeLevelId);
        $stmt->bindParam(':schoolYearId', $schoolYearId);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            // Section already exists, skip
            continue;
        }
        
        // Create new section
        $insertQuery = "
            INSERT INTO section 
            (SectionName, GradeLevelID, SchoolYearID, MaxCapacity, CurrentEnrollment)
            VALUES 
            (:sectionName, :gradeLevelId, :schoolYearId, :maxCapacity, 0)
        ";
        
        $stmt = $db->prepare($insertQuery);
        $stmt->bindParam(':sectionName', $sectionName);
        $stmt->bindParam(':gradeLevelId', $gradeLevelId);
        $stmt->bindParam(':schoolYearId', $schoolYearId);
        $stmt->bindParam(':maxCapacity', $maxCapacity);
        $stmt->execute();
        
        $createdSections[] = [
            'sectionId' => $db->lastInsertId(),
            'sectionName' => $sectionName,
            'maxCapacity' => $maxCapacity
        ];
    }
    
    $db->commit();
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => count($createdSections) . ' section(s) created successfully.',
        'data' => $createdSections
    ]);
    
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    
    // Log the full error for debugging
    error_log("Section creation error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error creating sections: ' . $e->getMessage(),
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'gradeLevelId' => $gradeLevelId ?? null,
            'schoolYearId' => $schoolYearId ?? null
        ]
    ]);
}
?>
