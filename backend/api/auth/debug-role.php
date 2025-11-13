<?php
/**
 * Debug Endpoint: Check User Role Information
 * Access: http://localhost/gymnazo-christian-academy-teacher-side/backend/api/auth/debug-role.php
 */

session_start();

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false, 
        'message' => 'Not authenticated',
        'session_data' => $_SESSION
    ]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

try {
    // Get user's role information
    $query = "
        SELECT 
            u.UserID,
            u.EmailAddress,
            u.UserType,
            CONCAT(p.FirstName, ' ', p.LastName) as FullName,
            ur.UserRoleID,
            ur.RoleID,
            ur.AssignedDate,
            r.RoleName,
            r.Description as RoleDescription,
            r.IsActive as RoleIsActive
        FROM user u
        LEFT JOIN profile p ON u.UserID = p.UserID
        LEFT JOIN userrole ur ON u.UserID = ur.UserID
        LEFT JOIN role r ON ur.RoleID = r.RoleID
        WHERE u.UserID = :userId
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':userId', $_SESSION['user_id']);
    $stmt->execute();
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Get all available roles
    $rolesQuery = "SELECT * FROM role WHERE IsActive = 1";
    $rolesStmt = $db->prepare($rolesQuery);
    $rolesStmt->execute();
    $allRoles = $rolesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'user_data' => $userData,
        'all_roles' => $allRoles,
        'session_user_id' => $_SESSION['user_id']
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
