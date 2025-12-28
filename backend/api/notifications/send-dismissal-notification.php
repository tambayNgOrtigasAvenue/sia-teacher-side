<?php
//Change it to sms, will do later.

session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/mailer.php';

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

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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
    
    // Get request body
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($input['sectionId']) || !isset($input['message']) || !isset($input['newDismissalTime'])) {
        throw new Exception('Section ID, message, and new dismissal time are required');
    }
    
    $sectionId = (int)$input['sectionId'];
    $message = $input['message'];
    $newDismissalTime = $input['newDismissalTime'];
    $originalEndTime = isset($input['originalEndTime']) ? $input['originalEndTime'] : '';
    $gradeLevel = isset($input['gradeLevel']) ? $input['gradeLevel'] : '';
    $section = isset($input['section']) ? $input['section'] : '';
    $subject = isset($input['subject']) ? $input['subject'] : '';
    $recipientType = isset($input['recipientType']) ? $input['recipientType'] : 'all';
    $parentId = isset($input['parentId']) ? (int)$input['parentId'] : null;
    
    // Get teacher information
    $teacherQuery = "
        SELECT p.FirstName, p.LastName, u.EmailAddress as Email
        FROM profile p
        JOIN user u ON p.UserID = u.UserID
        WHERE p.UserID = :userId
    ";
    $stmt = $db->prepare($teacherQuery);
    $stmt->bindParam(':userId', $_SESSION['user_id']);
    $stmt->execute();
    $teacher = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$teacher) {
        throw new Exception('Teacher profile not found');
    }
    
    $teacherName = $teacher['FirstName'] . ' ' . $teacher['LastName'];
    
    // Get parent emails based on recipient type
    $parentEmails = [];
    $parentNames = [];
    
    if ($recipientType === 'all') {
        // Get all parents/guardians of students in this section
        $parentQuery = "
            SELECT DISTINCT 
                COALESCE(CAST(AES_DECRYPT(g.EncryptedEmailAddress, 'encryption_key') AS CHAR), CAST(g.EncryptedEmailAddress AS CHAR)) AS Email,
                g.FullName,
                g.GuardianID
            FROM enrollment e
            JOIN studentprofile sp ON e.StudentProfileID = sp.StudentProfileID
            JOIN studentguardian sg ON sp.StudentProfileID = sg.StudentProfileID
            JOIN guardian g ON sg.GuardianID = g.GuardianID
            WHERE e.SectionID = :sectionId
            AND g.EncryptedEmailAddress IS NOT NULL
        ";
        $stmt = $db->prepare($parentQuery);
        $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    } elseif ($recipientType === 'student') {
        // Get all parents/guardians of a specific student
        if (!isset($input['studentId'])) {
            throw new Exception('Student ID is required for student recipient');
        }
        
        $studentId = (int)$input['studentId'];
        
        $parentQuery = "
            SELECT DISTINCT 
                COALESCE(CAST(AES_DECRYPT(g.EncryptedEmailAddress, 'encryption_key') AS CHAR), CAST(g.EncryptedEmailAddress AS CHAR)) AS Email,
                g.FullName,
                g.GuardianID
            FROM studentprofile sp
            JOIN studentguardian sg ON sp.StudentProfileID = sg.StudentProfileID
            JOIN guardian g ON sg.GuardianID = g.GuardianID
            WHERE sp.StudentProfileID = :studentId
            AND g.EncryptedEmailAddress IS NOT NULL
        ";
        $stmt = $db->prepare($parentQuery);
        $stmt->bindParam(':studentId', $studentId, PDO::PARAM_INT);
    } else {
        // Get specific parent/guardian
        if (!$parentId) {
            throw new Exception('Parent ID is required for specific recipient');
        }
        
        $parentQuery = "
            SELECT 
                COALESCE(CAST(AES_DECRYPT(g.EncryptedEmailAddress, 'encryption_key') AS CHAR), CAST(g.EncryptedEmailAddress AS CHAR)) AS Email,
                g.FullName
            FROM guardian g
            WHERE g.GuardianID = :parentId
            AND g.EncryptedEmailAddress IS NOT NULL
        ";
        $stmt = $db->prepare($parentQuery);
        $stmt->bindParam(':parentId', $parentId, PDO::PARAM_INT);
    }
    
    $stmt->execute();
    $parents = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($parents)) {
        throw new Exception('No parent emails found');
    }
    
    foreach ($parents as $parent) {
        $parentEmails[] = $parent['Email'];
        $parentNames[] = $parent['FullName'];
    }
    
    // Sanitize output for HTML
    $safeGradeLevel = htmlspecialchars($gradeLevel);
    $safeSection = htmlspecialchars($section);
    $safeSubject = htmlspecialchars($subject);
    $safeTeacherName = htmlspecialchars($teacherName);
    $safeOriginalEndTime = htmlspecialchars($originalEndTime);
    $safeNewDismissalTime = htmlspecialchars($newDismissalTime);
    $safeMessage = htmlspecialchars($message);

    // Create email content
    $emailSubject = "⚠️ Emergency: Class Dismissal Time Change - Grade $gradeLevel Section $section";
    
    $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f4d77d; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; color: #404040; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .info-box { background-color: #ffffff; padding: 20px; margin: 20px 0; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: bold; color: #666; }
            .info-value { color: #404040; }
            .time-change { background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
            .message-box { background-color: #ffffff; padding: 20px; margin: 20px 0; border-radius: 5px; border: 1px solid #ddd; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🏫 Gymnazo Christian Academy</h1>
                <p style='margin: 10px 0 0 0; font-size: 14px;'>Emergency Dismissal Notification</p>
            </div>
            
            <div class='content'>
                <div class='alert-box'>
                    <strong>⚠️ IMPORTANT NOTICE</strong>
                    <p style='margin: 10px 0 0 0;'>The dismissal time for your child's class has been changed due to an emergency.</p>
                </div>
                
                <div class='info-box'>
                    <h3 style='margin-top: 0; color: #404040;'>Class Information</h3>
                    <div class='info-row'>
                        <span class='info-label'>Grade Level:</span>
                        <span class='info-value'>Grade $safeGradeLevel</span>
                    </div>
                    <div class='info-row'>
                        <span class='info-label'>Section:</span>
                        <span class='info-value'>$safeSection</span>
                    </div>
                    <div class='info-row'>
                        <span class='info-label'>Subject:</span>
                        <span class='info-value'>$safeSubject</span>
                    </div>
                    <div class='info-row' style='border-bottom: none;'>
                        <span class='info-label'>Teacher:</span>
                        <span class='info-value'>$safeTeacherName</span>
                    </div>
                </div>
                
                <div class='time-change'>
                    <h3 style='margin-top: 0; color: #28a745;'>⏰ Time Change</h3>
                    <div class='info-row'>
                        <span class='info-label'>Original End Time:</span>
                        <span class='info-value'>$safeOriginalEndTime</span>
                    </div>
                    <div class='info-row' style='border-bottom: none;'>
                        <span class='info-label'>New Dismissal Time:</span>
                        <span class='info-value' style='color: #d9534f; font-weight: bold; font-size: 18px;'>$safeNewDismissalTime</span>
                    </div>
                </div>
                
                <div class='message-box'>
                    <h3 style='margin-top: 0; color: #404040;'>📝 Teacher's Message</h3>
                    <p style='white-space: pre-wrap; margin: 0;'>$safeMessage</p>
                </div>
                
                <p style='margin-top: 30px; padding: 15px; background-color: #fff; border-radius: 5px; border-left: 4px solid #f4d77d;'>
                    <strong>Please arrange for pick-up at the new dismissal time.</strong> If you have any questions or concerns, please contact the school office immediately.
                </p>
                
                <div class='footer'>
                    <p><strong>Gymnazo Christian Academy</strong></p>
                    <p>This is an automated notification. Please do not reply to this email.</p>
                    <p>Date & Time: " . date('F j, Y - g:i A') . "</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Send emails using PHPMailer
    $mailer = getMailer();
    $successCount = 0;
    $failedEmails = [];
    
    foreach ($parentEmails as $index => $email) {
        try {
            $mailer->clearAddresses();
            $mailer->addAddress($email, $parentNames[$index]);
            $mailer->Subject = $emailSubject;
            $mailer->Body = $emailBody;
            $mailer->AltBody = strip_tags(str_replace('<br>', "\n", $emailBody));
            
            if ($mailer->send()) {
                $successCount++;
            } else {
                $failedEmails[] = $email;
            }
        } catch (Exception $e) {
            $failedEmails[] = $email;
            error_log("Failed to send email to $email: " . $e->getMessage());
        }
    }
    
    // Log the notification in the database (table doesn't exist yet, skipping for now)
    // TODO: Create notifications table in database
    /*
    $logQuery = "
        INSERT INTO notifications 
        (SenderID, RecipientType, SectionID, Title, Message, NotificationDate, Status)
        VALUES 
        (:senderId, :recipientType, :sectionId, :title, :message, NOW(), 'sent')
    ";
    $stmt = $db->prepare($logQuery);
    $stmt->bindParam(':senderId', $_SESSION['user_id'], PDO::PARAM_INT);
    $stmt->bindParam(':recipientType', $recipientType, PDO::PARAM_STR);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $stmt->bindParam(':title', $emailSubject, PDO::PARAM_STR);
    $stmt->bindParam(':message', $message, PDO::PARAM_STR);
    $stmt->execute();
    */
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => "✅ Notification sent successfully to $successCount parent(s)" . (count($failedEmails) > 0 ? " ($failedEmails failed)" : ""),
        'data' => [
            'totalSent' => $successCount,
            'totalFailed' => count($failedEmails),
            'failedEmails' => $failedEmails,
            'sentEmails' => $parentEmails,
            'recipients' => $parentNames,
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'line' => $e->getLine()
    ]);
}
?>
