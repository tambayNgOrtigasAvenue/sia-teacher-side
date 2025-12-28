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
    
    // Get section ID from query parameters
    if (!isset($_GET['sectionId'])) {
        throw new Exception('Section ID is required');
    }
    
    $sectionId = (int)$_GET['sectionId'];
    
    // Get all students in this section and their guardians
    $query = "
        SELECT 
            sp.StudentProfileID as studentId,
            sp_prof.FirstName as studentFirstName,
            sp_prof.LastName as studentLastName,
            g.GuardianID as guardianId,
            g.FullName as guardianName,
            COALESCE(CAST(AES_DECRYPT(g.EncryptedEmailAddress, 'encryption_key') AS CHAR), CAST(g.EncryptedEmailAddress AS CHAR)) as guardianEmail,
            COALESCE(CAST(AES_DECRYPT(g.EncryptedPhoneNumber, 'encryption_key') AS CHAR), CAST(g.EncryptedPhoneNumber AS CHAR)) as guardianPhone,
            sg.RelationshipType as relationship
        FROM enrollment e
        JOIN studentprofile sp ON e.StudentProfileID = sp.StudentProfileID
        JOIN profile sp_prof ON sp.ProfileID = sp_prof.ProfileID
        LEFT JOIN studentguardian sg ON sp.StudentProfileID = sg.StudentProfileID
        LEFT JOIN guardian g ON sg.GuardianID = g.GuardianID
        WHERE e.SectionID = :sectionId
        ORDER BY sp_prof.LastName, sp_prof.FirstName, g.FullName
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    
    if (!$stmt->execute()) {
        throw new Exception('Database query failed: ' . implode(', ', $stmt->errorInfo()));
    }
    
    $studentsMap = [];
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $studentId = $row['studentId'];
        
        if (!isset($studentsMap[$studentId])) {
            $studentsMap[$studentId] = [
                'id' => (int)$studentId,
                'name' => $row['studentFirstName'] . ' ' . $row['studentLastName'],
                'guardians' => []
            ];
        }
        
        if ($row['guardianId']) {
            $studentsMap[$studentId]['guardians'][] = [
                'id' => (int)$row['guardianId'],
                'name' => $row['guardianName'],
                'email' => $row['guardianEmail'],
                'phone' => $row['guardianPhone'],
                'relationship' => $row['relationship']
            ];
        }
    }
    
    // Convert map to array (values only)
    $students = array_values($studentsMap);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $students,
        'count' => count($students)
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'sql_error' => $e->errorInfo ?? null
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'line' => $e->getLine(),
        'file' => basename($e->getFile())
    ]);
}
?>
