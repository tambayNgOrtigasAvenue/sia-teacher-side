<?php
/**
 * Update Student Profile API
 * 
 * Allows teachers to update student profile information
 * Updates studentprofile table with new information
 */

require_once '../../config/cors.php';
header('Content-Type: application/json');

require_once '../../config/db.php';

session_start();

// Check if user is logged in and is a teacher
// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized access'
    ]);
    exit();
}

try {
    // Get database connection
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception('Database connection failed');
    }
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // If not JSON, try $_POST (for FormData)
    if (!$input) {
        $input = $_POST;
    }
    
    // Log the received data for debugging
    error_log("Update student profile input: " . print_r($input, true));
    
    if (empty($input)) {
        throw new Exception('Invalid input data');
    }

    // Validate required fields
    $studentId = $input['studentId'] ?? null;
    $firstName = $input['firstName'] ?? null;
    $lastName = $input['lastName'] ?? null;
    
    if (!$studentId || !$firstName || !$lastName) {
        throw new Exception('Student ID, first name, and last name are required');
    }

    // Optional fields
    $middleName = $input['middleName'] ?? '';
    $gender = $input['gender'] ?? null;
    $birthdate = !empty($input['birthdate']) ? $input['birthdate'] : null;
    $age = $input['age'] ?? null;
    $studentNumber = !empty($input['studentNumber']) ? $input['studentNumber'] : null;
    $address = $input['address'] ?? '';
    $contactNumber = $input['contactNumber'] ?? '';

    // Start transaction
    $db->beginTransaction();

    // Get student's profile ID
    $stmt = $db->prepare("
        SELECT ProfileID 
        FROM studentprofile 
        WHERE StudentProfileID = :studentId
    ");
    $stmt->bindParam(':studentId', $studentId);
    $stmt->execute();
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        throw new Exception('Student not found');
    }

    $profileId = $student['ProfileID'];

    // Handle Profile Picture Upload
    $profilePictureUrl = null;
    if (isset($_FILES['profilePicture']) && $_FILES['profilePicture']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['profilePicture'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!in_array($file['type'], $allowedTypes)) {
            throw new Exception('Invalid file type. Only JPG, PNG, GIF, and WEBP allowed.');
        }
        
        if ($file['size'] > 5 * 1024 * 1024) { // 5MB limit
            throw new Exception('File size too large. Max 5MB.');
        }
        
        // Create upload directory
        $uploadDir = __DIR__ . '/../../uploads/profile-pictures/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        // Generate unique filename
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'profile_' . $profileId . '_' . time() . '.' . $ext;
        $targetPath = $uploadDir . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            // Construct URL (adjust base URL as needed)
            // Assuming server runs on localhost/SMS-GCA-3H/Teacher/backend
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            $baseUrl = "$protocol://$host/SMS-GCA-3H/Teacher/backend/uploads/profile-pictures/";
            $profilePictureUrl = $baseUrl . $filename;
        } else {
            throw new Exception('Failed to upload file.');
        }
    }

    // Update profile table
    $updateProfile = "
        UPDATE profile 
        SET 
            FirstName = :firstName,
            MiddleName = :middleName,
            LastName = :lastName
    ";
    
    $params = [
        ':firstName' => $firstName,
        ':middleName' => $middleName,
        ':lastName' => $lastName,
        ':profileId' => $profileId
    ];

    if ($gender !== null) {
        $updateProfile .= ", Gender = :gender";
        $params[':gender'] = $gender;
    }
    
    if ($profilePictureUrl) {
        $updateProfile .= ", ProfilePictureURL = :profilePictureUrl";
        $params[':profilePictureUrl'] = $profilePictureUrl;
    }

    // Add encrypted fields if provided
    if (!empty($contactNumber)) {
        $updateProfile .= ", EncryptedPhoneNumber = AES_ENCRYPT(:phoneNumber, 'encryption_key')";
        $params[':phoneNumber'] = $contactNumber;
    }

    if (!empty($address)) {
        $updateProfile .= ", EncryptedAddress = AES_ENCRYPT(:address, 'encryption_key')";
        $params[':address'] = $address;
    }

    $updateProfile .= " WHERE ProfileID = :profileId";

    $stmt = $db->prepare($updateProfile);
    if (!$stmt->execute($params)) {
        throw new Exception('Failed to update profile table: ' . implode(', ', $stmt->errorInfo()));
    }
    error_log("Profile updated successfully for ProfileID: $profileId");

    // Update studentprofile table
    $studentParams = [':studentId' => $studentId];
    $updateFields = [];
    
    if ($birthdate !== null) {
        $updateFields[] = "DateOfBirth = :birthdate";
        $studentParams[':birthdate'] = $birthdate;
    }
    
    if ($studentNumber !== null && !empty($studentNumber)) {
        $updateFields[] = "StudentNumber = :studentNumber";
        $studentParams[':studentNumber'] = $studentNumber;
    }

    if ($gender !== null) {
        $updateFields[] = "Gender = :gender";
        $studentParams[':gender'] = $gender;
    }

    // Only update if there are fields to update
    if (!empty($updateFields)) {
        $updateStudent = "
            UPDATE studentprofile 
            SET " . implode(', ', $updateFields) . "
            WHERE StudentProfileID = :studentId
        ";

        $stmt = $db->prepare($updateStudent);
        if (!$stmt->execute($studentParams)) {
            throw new Exception('Failed to update studentprofile table: ' . implode(', ', $stmt->errorInfo()));
        }
        error_log("StudentProfile updated successfully for StudentProfileID: $studentId");
    }

    // Commit transaction
    $db->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Student profile updated successfully',
        'data' => [
            'studentId' => $studentId,
            'firstName' => $firstName,
            'middleName' => $middleName,
            'lastName' => $lastName,
            'gender' => $gender,
            'profilePicture' => $profilePictureUrl,
            'birthdate' => $birthdate,
            'age' => $age,
            'studentNumber' => $studentNumber,
            'address' => $address,
            'contactNumber' => $contactNumber
        ]
    ]);

} catch (Exception $e) {
    // Rollback transaction on error
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    
    // Log the error
    error_log("Update student profile error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'debug' => [
            'file' => basename($e->getFile()),
            'line' => $e->getLine()
        ]
    ]);
}
