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
    
    // Get all parents of students in this section
    $query = "
        SELECT DISTINCT 
            p.ProfileID as id,
            CONCAT(p.FirstName, ' ', p.LastName) as name,
            p.Email as email,
            p.ContactNumber as phone,
            sp_prof.FirstName as studentFirstName,
            sp_prof.LastName as studentLastName
        FROM studentprofile sp
        JOIN profile sp_prof ON sp.ProfileID = sp_prof.ProfileID
        JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
        JOIN profile p ON sp_prof.ParentID = p.ProfileID
        WHERE e.SectionID = :sectionId
        AND p.Email IS NOT NULL
        AND p.Email != ''
        ORDER BY p.LastName ASC, p.FirstName ASC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $stmt->execute();
    
    $parents = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $parents[] = [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'studentName' => $row['studentFirstName'] . ' ' . $row['studentLastName']
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $parents,
        'count' => count($parents)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
