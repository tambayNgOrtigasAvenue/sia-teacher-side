<?php
header('Content-Type: application/json');
require_once '../../config/cors.php';

require_once '../../config/db.php';
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please login first.'
    ]);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

$teacherId = $data['teacherId'] ?? null;
$sectionId = $data['sectionId'] ?? null;

if (!$teacherId) {
    echo json_encode([
        'success' => false,
        'message' => 'Teacher ID is required'
    ]);
    exit();
}

if (!$sectionId) {
    echo json_encode([
        'success' => false,
        'message' => 'Section ID is required'
    ]);
    exit();
}

// Get database connection
$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]);
    exit();
}

try {
    $conn->beginTransaction();

    // Check if teacher profile exists
    $stmt = $conn->prepare("
        SELECT TeacherProfileID 
        FROM teacherprofile tp
        JOIN profile p ON tp.ProfileID = p.ProfileID
        WHERE p.UserID = :teacherId
    ");
    $stmt->bindParam(':teacherId', $teacherId, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        throw new Exception('Teacher profile not found');
    }
    
    $teacherProfile = $stmt->fetch(PDO::FETCH_ASSOC);
    $teacherProfileId = $teacherProfile['TeacherProfileID'];

    // Check if section exists and get its details
    $stmt = $conn->prepare("
        SELECT s.SectionID, s.SectionName, s.GradeLevelID, s.SchoolYearID, s.AdviserTeacherID,
               gl.LevelName as grade_level_name,
               sy.YearName
        FROM section s
        JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
        JOIN schoolyear sy ON s.SchoolYearID = sy.SchoolYearID
        WHERE s.SectionID = :sectionId
    ");
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        throw new Exception('Section not found');
    }
    
    $section = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if teacher is already assigned to this section
    if ($section['AdviserTeacherID'] == $teacherProfileId) {
        throw new Exception('You are already assigned to this section');
    }

    // Check if section already has a teacher assigned
    if ($section['AdviserTeacherID'] !== null) {
        $stmt = $conn->prepare("
            SELECT p.FirstName, p.LastName 
            FROM teacherprofile tp
            JOIN profile p ON tp.ProfileID = p.ProfileID
            WHERE tp.TeacherProfileID = :teacherProfileId
        ");
        $stmt->bindParam(':teacherProfileId', $section['AdviserTeacherID'], PDO::PARAM_INT);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $existingTeacher = $stmt->fetch(PDO::FETCH_ASSOC);
            throw new Exception('This section is already assigned to ' . $existingTeacher['FirstName'] . ' ' . $existingTeacher['LastName']);
        }
    }

    // Update section with the teacher as adviser
    $stmt = $conn->prepare("
        UPDATE section 
        SET AdviserTeacherID = :teacherProfileId
        WHERE SectionID = :sectionId
    ");
    $stmt->bindParam(':teacherProfileId', $teacherProfileId, PDO::PARAM_INT);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    
    if (!$stmt->execute()) {
        throw new Exception('Failed to assign teacher to section');
    }

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Successfully assigned to ' . $section['grade_level_name'] . ' - Section ' . $section['SectionName'] . '. Use Teacher Schedules tab to create detailed class schedules.',
        'data' => [
            'sectionId' => $sectionId,
            'sectionName' => $section['SectionName'],
            'gradeLevel' => $section['grade_level_name']
        ]
    ]);

} catch (Exception $e) {
    if ($conn && $conn->inTransaction()) {
        $conn->rollback();
    }
    
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
