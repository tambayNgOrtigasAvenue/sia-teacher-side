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
    
    // Validate input
    if (!isset($_GET['studentId']) || !isset($_GET['sectionId'])) {
        throw new Exception('Student ID and Section ID are required');
    }
    
    $studentId = (int)$_GET['studentId'];
    $sectionId = (int)$_GET['sectionId'];
    
    // Fetch all grades for this student across all subjects in this section
    $query = "
        SELECT 
            s.SubjectID,
            MAX(CASE WHEN g.Quarter = 'First Quarter' THEN g.GradeValue END) as q1,
            MAX(CASE WHEN g.Quarter = 'Second Quarter' THEN g.GradeValue END) as q2,
            MAX(CASE WHEN g.Quarter = 'Third Quarter' THEN g.GradeValue END) as q3,
            MAX(CASE WHEN g.Quarter = 'Fourth Quarter' THEN g.GradeValue END) as q4,
            MAX(g.Remarks) as remarks
        FROM enrollment e
        JOIN section sec ON e.SectionID = sec.SectionID
        JOIN subject s ON sec.GradeLevelID = s.GradeLevelID AND s.IsActive = 1
        LEFT JOIN grade g ON e.EnrollmentID = g.EnrollmentID AND g.SubjectID = s.SubjectID
        WHERE e.StudentProfileID = :studentId
        AND e.SectionID = :sectionId
        GROUP BY s.SubjectID
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':studentId', $studentId, PDO::PARAM_INT);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $stmt->execute();
    
    $grades = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $grades[$row['SubjectID']] = [
            'q1' => $row['q1'] ? (float)$row['q1'] : null,
            'q2' => $row['q2'] ? (float)$row['q2'] : null,
            'q3' => $row['q3'] ? (float)$row['q3'] : null,
            'q4' => $row['q4'] ? (float)$row['q4'] : null,
            'remarks' => $row['remarks']
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $grades
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
