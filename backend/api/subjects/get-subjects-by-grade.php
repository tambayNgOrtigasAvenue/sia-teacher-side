<?php
session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

header("Content-Type: application/json; charset=UTF-8");

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please log in.'
    ]);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
    exit();
}

try {
    // Get database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Get grade level ID from query parameter
    if (!isset($_GET['gradeLevelId'])) {
        throw new Exception('Grade Level ID is required');
    }
    
    $gradeLevelId = (int)$_GET['gradeLevelId'];
    
    // Fetch subjects for this grade level
    $query = "
        SELECT 
            SubjectID as id,
            SubjectName as name,
            SubjectCode as code
        FROM subject
        WHERE GradeLevelID = :gradeLevelId
        AND IsActive = 1
        ORDER BY SubjectName ASC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':gradeLevelId', $gradeLevelId, PDO::PARAM_INT);
    $stmt->execute();
    
    $subjects = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $subjects[] = [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'code' => $row['code']
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $subjects
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
