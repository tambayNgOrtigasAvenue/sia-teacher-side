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
        'message' => 'Unauthorized'
    ]);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get quarter from query parameter (default to q1)
    $quarter = isset($_GET['quarter']) ? $_GET['quarter'] : 'q1';
    
    // Convert quarter format
    $quarterMap = [
        'q1' => 'First Quarter',
        'q2' => 'Second Quarter',
        'q3' => 'Third Quarter',
        'q4' => 'Fourth Quarter'
    ];
    
    if (!isset($quarterMap[$quarter])) {
        throw new Exception('Invalid quarter value');
    }
    
    $quarterValue = $quarterMap[$quarter];
    
    // Get active school year
    $schoolYearQuery = "SELECT SchoolYearID FROM schoolyear WHERE IsActive = 1 LIMIT 1";
    $schoolYearStmt = $db->prepare($schoolYearQuery);
    $schoolYearStmt->execute();
    $schoolYear = $schoolYearStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$schoolYear) {
        throw new Exception('No active school year found');
    }
    
    $schoolYearId = $schoolYear['SchoolYearID'];
    
    // Debug: Log the values being searched
    error_log("DEBUG check-grading-deadline: SchoolYearID = $schoolYearId, Quarter = $quarterValue");
    
    // Check if deadline exists and is within grading period
    $deadlineQuery = "
        SELECT 
            DeadlineID,
            Quarter,
            StartDate,
            DeadlineDate,
            CASE 
                WHEN NOW() < StartDate THEN 'not_started'
                WHEN NOW() BETWEEN StartDate AND DeadlineDate THEN 'active'
                WHEN NOW() > DeadlineDate THEN 'expired'
            END as status
        FROM gradesubmissiondeadline
        WHERE SchoolYearID = :schoolYearId
        AND Quarter = :quarter
        LIMIT 1
    ";
    
    $deadlineStmt = $db->prepare($deadlineQuery);
    $deadlineStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $deadlineStmt->bindParam(':quarter', $quarterValue, PDO::PARAM_STR);
    $deadlineStmt->execute();
    $deadline = $deadlineStmt->fetch(PDO::FETCH_ASSOC);
    
    // Debug: Log what was found
    error_log("DEBUG check-grading-deadline: Deadline found = " . ($deadline ? 'YES' : 'NO'));
    if ($deadline) {
        error_log("DEBUG check-grading-deadline: Status = " . $deadline['status']);
    }
    
    if (!$deadline) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'hasDeadline' => false,
            'message' => 'No grading deadline has been set for this quarter',
            'canGrade' => false,
            'debug' => [
                'schoolYearId' => $schoolYearId,
                'quarter' => $quarterValue,
                'quarterParam' => $quarter
            ]
        ]);
        exit();
    }
    
    $canGrade = ($deadline['status'] === 'active');
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'hasDeadline' => true,
        'canGrade' => $canGrade,
        'deadline' => [
            'deadlineId' => $deadline['DeadlineID'],
            'quarter' => $deadline['Quarter'],
            'startDate' => $deadline['StartDate'],
            'deadlineDate' => $deadline['DeadlineDate'],
            'status' => $deadline['status']
        ],
        'message' => $canGrade 
            ? 'Grading is currently open'
            : ($deadline['status'] === 'not_started' 
                ? 'Grading period has not started yet' 
                : 'Grading deadline has passed')
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
