<?php
/**
 * API Endpoint: Get My Schedule (Teacher's assigned classes grouped by grade/section)
 * Method: GET
 * Returns the teacher's schedule grouped by grade and section
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
    // Get teacher profile ID
    $teacherQuery = "
        SELECT tp.TeacherProfileID 
        FROM teacherprofile tp
        JOIN profile p ON tp.ProfileID = p.ProfileID
        WHERE p.UserID = :userId
    ";
    
    $stmt = $db->prepare($teacherQuery);
    $stmt->bindParam(':userId', $_SESSION['user_id']);
    $stmt->execute();
    $teacher = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$teacher) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Teacher profile not found.']);
        exit();
    }
    
    // Get teacher's sections grouped by grade
    // This includes sections assigned as adviser
    // Status is based on whether the section has any class schedules
    $query = "
        SELECT DISTINCT
            gl.GradeLevelID,
            gl.LevelName as grade,
            sec.SectionID,
            sec.SectionName as sectionName,
            COALESCE(cs.RoomNumber, 'TBD') as room,
            CASE 
                WHEN COUNT(cs.ScheduleID) > 0 THEN 'Approved'
                ELSE 'Pending'
            END as status,
            CONCAT(p.FirstName, ' ', p.LastName) as adviserName
        FROM section sec
        JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
        LEFT JOIN classschedule cs ON cs.SectionID = sec.SectionID
        LEFT JOIN teacherprofile tp ON sec.AdviserTeacherID = tp.TeacherProfileID
        LEFT JOIN profile p ON tp.ProfileID = p.ProfileID
        WHERE sec.AdviserTeacherID = :teacherProfileId
        GROUP BY gl.GradeLevelID, gl.LevelName, sec.SectionID, sec.SectionName, p.FirstName, p.LastName
        ORDER BY gl.LevelName, sec.SectionName
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':teacherProfileId', $teacher['TeacherProfileID']);
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Group by grade level
    $schedules = [];
    $gradeMap = [];
    
    foreach ($results as $row) {
        $gradeLevelId = $row['GradeLevelID'];
        
        if (!isset($gradeMap[$gradeLevelId])) {
            $gradeIndex = count($schedules);
            $gradeMap[$gradeLevelId] = $gradeIndex;
            
            $schedules[] = [
                'id' => $gradeLevelId,
                'grade' => 'GRADE ' . $row['grade'],
                'adviser' => $row['adviserName'] ?? 'N/A',
                'sections' => []
            ];
        }
        
        $gradeIndex = $gradeMap[$gradeLevelId];
        
        $schedules[$gradeIndex]['sections'][] = [
            'id' => $row['SectionID'],
            'name' => 'Section ' . $row['sectionName'],
            'room' => $row['room'] ?? 'TBD',
            'status' => $row['status'] ?? 'Pending',
            'isFavorite' => false // TODO: Implement favorites feature
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $schedules
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching schedule: ' . $e->getMessage()
    ]);
}
?>
