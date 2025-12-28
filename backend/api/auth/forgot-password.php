<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/mailer.php';

class ForgotPasswordHandler {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function requestPasswordReset($email) {
        try {
            // Check if email exists and belongs to a teacher
            $query = "
                SELECT 
                    u.UserID,
                    u.EmailAddress,
                    u.AccountStatus,
                    p.FirstName,
                    p.LastName,
                    tp.EmployeeNumber
                FROM 
                    user u
                JOIN 
                    profile p ON u.UserID = p.UserID
                JOIN 
                    teacherprofile tp ON p.ProfileID = tp.ProfileID
                WHERE 
                    u.EmailAddress = :email 
                    AND u.UserType = 'Teacher'
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Always return success to prevent email enumeration attacks
            if (!$user) {
                return [
                    'success' => true,
                    'message' => 'If an account exists with this email, you will receive a password reset link shortly.'
                ];
            }

            // Check if account is active
            if ($user['AccountStatus'] !== 'Active') {
                return [
                    'success' => true,
                    'message' => 'If an account exists with this email, you will receive a password reset link shortly.'
                ];
            }

            // Generate secure reset token
            $token = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

            // Store token in database
            $this->storeResetToken($user['UserID'], $token, $expiresAt);

            // Send reset email
            $this->sendResetEmail($user, $token);

            return [
                'success' => true,
                'message' => 'If an account exists with this email, you will receive a password reset link shortly.'
            ];

        } catch (Exception $e) {
            error_log("Password reset request error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred. Please try again later.'
            ];
        }
    }

    private function storeResetToken($userId, $token, $expiresAt) {
        // First, invalidate any existing tokens for this user
        $deleteQuery = "DELETE FROM password_reset_tokens WHERE UserID = :userId";
        $stmt = $this->conn->prepare($deleteQuery);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();

        // Insert new token
        $insertQuery = "
            INSERT INTO password_reset_tokens 
            (UserID, Token, ExpiresAt, CreatedAt) 
            VALUES 
            (:userId, :token, :expiresAt, NOW())
        ";

        $stmt = $this->conn->prepare($insertQuery);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':expiresAt', $expiresAt);
        $stmt->execute();
    }

    private function sendResetEmail($user, $token) {
        try {
            $mail = getMailer();

            // Recipient
            $mail->addAddress($user['EmailAddress'], $user['FirstName'] . ' ' . $user['LastName']);

            // Content
            $mail->isHTML(true);
            $mail->Subject = 'Password Reset Request - Gymnazo Christian Academy';

            // Create reset link (adjust the domain as needed)
            $resetLink = "http://localhost:5173/reset-password?token=" . $token;

            $mail->Body = $this->getEmailTemplate($user, $resetLink);
            $mail->AltBody = "Hello {$user['FirstName']},\n\nWe received a request to reset your password.\n\nClick the link below to reset your password:\n{$resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nGymnazo Christian Academy";

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Email sending failed: " . $e->getMessage());
            return false;
        }
    }

    private function getEmailTemplate($user, $resetLink) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        </head>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>
            <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
                <h1 style='color: white; margin: 0;'>Password Reset Request</h1>
            </div>
            
            <div style='background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;'>
                <p>Hello <strong>{$user['FirstName']} {$user['LastName']}</strong>,</p>
                
                <p>We received a request to reset the password for your teacher account (Employee #: {$user['EmployeeNumber']}).</p>
                
                <p>Click the button below to reset your password:</p>
                
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{$resetLink}' style='background-color: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;'>Reset Password</a>
                </div>
                
                <p style='color: #666; font-size: 14px;'>Or copy and paste this link into your browser:</p>
                <p style='background-color: #e9e9e9; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;'>{$resetLink}</p>
                
                <div style='background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;'>
                    <p style='margin: 0; color: #856404;'><strong>⚠️ Important:</strong> This link will expire in <strong>1 hour</strong>.</p>
                </div>
                
                <p style='color: #666; font-size: 14px;'>If you didn't request a password reset, please ignore this email or contact the school administration if you have concerns.</p>
                
                <hr style='border: none; border-top: 1px solid #ddd; margin: 30px 0;'>
                
                <p style='color: #999; font-size: 12px; text-align: center;'>
                    <strong>Gymnazo Christian Academy</strong><br>
                    Teacher Management System<br>
                    This is an automated message, please do not reply to this email.
                </p>
            </div>
        </body>
        </html>
        ";
    }
}

// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['email']) || empty(trim($data['email']))) {
        echo json_encode([
            'success' => false,
            'message' => 'Email address is required.'
        ]);
        exit;
    }

    $email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please provide a valid email address.'
        ]);
        exit;
    }

    $database = new Database();
    $db = $database->getConnection();

    $handler = new ForgotPasswordHandler($db);
    $result = $handler->requestPasswordReset($email);

    echo json_encode($result);
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
}
