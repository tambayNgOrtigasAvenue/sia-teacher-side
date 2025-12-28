<?php
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

// Check authentication (optional for cron jobs)
$isCronJob = isset($_SERVER['HTTP_X_CRON_KEY']) && $_SERVER['HTTP_X_CRON_KEY'] === 'your-secret-cron-key';
if (!$isCronJob && !isset($_SESSION['user_id'])) {
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
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Get section ID (optional - if not provided, process all sections)
    $sectionId = isset($input['sectionId']) ? (int)$input['sectionId'] : null;
    
    // Get the date to process (default: yesterday)
    $processDate = isset($input['date']) ? $input['date'] : date('Y-m-d', strtotime('-1 day'));
    $today = date('Y-m-d');
    
    // Don't process today or future dates
    if ($processDate >= $today) {
        echo json_encode([
            'success' => true,
            'message' => 'No action needed - cannot mark today or future dates as absent automatically.',
            'marked' => 0
        ]);
        exit();
    }
    
    // Skip weekends (Saturday = 6, Sunday = 0)
    $dayOfWeek = date('w', strtotime($processDate));
    if ($dayOfWeek == 0 || $dayOfWeek == 6) {
        echo json_encode([
            'success' => true,
            'message' => 'Skipped - ' . $processDate . ' is a weekend.',
            'marked' => 0
        ]);
        exit();
    }
    
    $db->beginTransaction();
    
    // Find students who don't have attendance records for the specified date
    // and are enrolled in active sections
    $findUnmarkedQuery = "
        SELECT DISTINCT
            sp.StudentProfileID,
            e.SectionID,
            cs.ScheduleID
        FROM studentprofile sp
        JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
        JOIN section s ON e.SectionID = s.SectionID
        JOIN schoolyear sy ON s.SchoolYearID = sy.SchoolYearID
        LEFT JOIN classschedule cs ON cs.SectionID = e.SectionID
        WHERE sy.IsActive = 1
        AND e.EnrollmentID IN (
            SELECT MAX(EnrollmentID) 
            FROM enrollment 
            WHERE StudentProfileID = sp.StudentProfileID
            GROUP BY StudentProfileID
        )
        AND NOT EXISTS (
            SELECT 1 FROM attendance a 
            WHERE a.StudentProfileID = sp.StudentProfileID 
            AND DATE(a.AttendanceDate) = :processDate
        )
    ";
    
    // Add section filter if provided
    if ($sectionId) {
        $findUnmarkedQuery .= " AND e.SectionID = :sectionId";
    }
    
    $stmt = $db->prepare($findUnmarkedQuery);
    $stmt->bindParam(':processDate', $processDate, PDO::PARAM_STR);
    if ($sectionId) {
        $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    }
    $stmt->execute();
    
    $unmarkedStudents = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $markedCount = 0;
    
    // Insert absent records for each unmarked student
    foreach ($unmarkedStudents as $student) {
        $insertQuery = "
            INSERT INTO attendance 
            (StudentProfileID, ClassScheduleID, AttendanceDate, AttendanceStatus, Notes, CheckInTime)
            VALUES 
            (:studentId, :scheduleId, :attendanceDate, 'Absent', 'Auto-marked absent (no record)', NULL)
        ";
        
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(':studentId', $student['StudentProfileID'], PDO::PARAM_INT);
        $insertStmt->bindParam(':scheduleId', $student['ScheduleID'], PDO::PARAM_INT);
        $insertStmt->bindParam(':attendanceDate', $processDate, PDO::PARAM_STR);
        
        if ($insertStmt->execute()) {
            $markedCount++;
        }
    }
    
    $db->commit();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => "Successfully marked $markedCount students as absent for $processDate",
        'marked' => $markedCount,
        'date' => $processDate
    ]);
    
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error processing auto-absent: ' . $e->getMessage()
    ]);
}
?>
