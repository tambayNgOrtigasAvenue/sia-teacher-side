<?php
// backend/students/getStudents.php

require_once '../config/cors.php';
require_once '../config/db.php';

// Check authentication token (we'll implement this properly later)
// For now, just return students

try {
    $query = "SELECT 
                sp.StudentProfileID,
                sp.StudentNumber,
                sp.StudentStatus,
                p.FirstName,
                p.LastName,
                p.MiddleName,
                u.EmailAddress,
                u.AccountStatus
              FROM studentprofile sp
              INNER JOIN profile p ON sp.ProfileID = p.ProfileID
              INNER JOIN user u ON p.UserID = u.UserID
              WHERE u.IsDeleted = 0
              ORDER BY sp.StudentNumber";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $students
    ]);
    
} catch (PDOException $e) {
    error_log("Get students error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>