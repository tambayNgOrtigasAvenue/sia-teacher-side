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

class ResetPasswordHandler {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function resetPassword($token, $newPassword) {
        try {
            // Validate token
            $query = "
                SELECT 
                    prt.UserID,
                    prt.ExpiresAt,
                    u.EmailAddress,
                    p.FirstName,
                    p.LastName
                FROM 
                    password_reset_tokens prt
                JOIN 
                    user u ON prt.UserID = u.UserID
                JOIN 
                    profile p ON u.UserID = p.UserID
                WHERE 
                    prt.Token = :token 
                    AND prt.ExpiresAt > NOW()
                    AND prt.Used = 0
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();

            $resetRequest = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$resetRequest) {
                return [
                    'success' => false,
                    'message' => 'Invalid or expired reset token. Please request a new password reset.'
                ];
            }

            // Validate password strength
            $passwordValidation = $this->validatePassword($newPassword);
            if (!$passwordValidation['valid']) {
                return [
                    'success' => false,
                    'message' => $passwordValidation['message']
                ];
            }

            // Hash the new password
            $passwordHash = password_hash($newPassword, PASSWORD_BCRYPT);

            // Begin transaction
            $this->conn->beginTransaction();

            // Update password in passwordpolicy table
            $updateQuery = "
                UPDATE passwordpolicy 
                SET 
                    PasswordHash = :passwordHash,
                    PasswordSetDate = NOW(),
                    LastPasswordChange = NOW()
                WHERE 
                    UserID = :userId
            ";

            $stmt = $this->conn->prepare($updateQuery);
            $stmt->bindParam(':passwordHash', $passwordHash);
            $stmt->bindParam(':userId', $resetRequest['UserID']);
            $stmt->execute();

            // Add to password history
            $historyQuery = "
                INSERT INTO passwordhistory 
                (UserID, PasswordHash, ChangedAt) 
                VALUES 
                (:userId, :passwordHash, NOW())
            ";

            $stmt = $this->conn->prepare($historyQuery);
            $stmt->bindParam(':userId', $resetRequest['UserID']);
            $stmt->bindParam(':passwordHash', $passwordHash);
            $stmt->execute();

            // Mark token as used
            $markUsedQuery = "
                UPDATE password_reset_tokens 
                SET Used = 1 
                WHERE Token = :token
            ";

            $stmt = $this->conn->prepare($markUsedQuery);
            $stmt->bindParam(':token', $token);
            $stmt->execute();

            // Commit transaction
            $this->conn->commit();

            return [
                'success' => true,
                'message' => 'Your password has been successfully reset. You can now log in with your new password.'
            ];

        } catch (Exception $e) {
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            error_log("Password reset error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred while resetting your password. Please try again.'
            ];
        }
    }

    public function verifyToken($token) {
        try {
            $query = "
                SELECT 
                    UserID,
                    ExpiresAt
                FROM 
                    password_reset_tokens
                WHERE 
                    Token = :token 
                    AND ExpiresAt > NOW()
                    AND Used = 0
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return [
                'success' => (bool)$result,
                'valid' => (bool)$result
            ];

        } catch (Exception $e) {
            error_log("Token verification error: " . $e->getMessage());
            return [
                'success' => false,
                'valid' => false,
                'message' => 'An error occurred while verifying the token.'
            ];
        }
    }

    private function validatePassword($password) {
        if (strlen($password) < 8) {
            return [
                'valid' => false,
                'message' => 'Password must be at least 8 characters long.'
            ];
        }

        if (!preg_match('/[A-Z]/', $password)) {
            return [
                'valid' => false,
                'message' => 'Password must contain at least one uppercase letter.'
            ];
        }

        if (!preg_match('/[a-z]/', $password)) {
            return [
                'valid' => false,
                'message' => 'Password must contain at least one lowercase letter.'
            ];
        }

        if (!preg_match('/[0-9]/', $password)) {
            return [
                'valid' => false,
                'message' => 'Password must contain at least one number.'
            ];
        }

        return ['valid' => true];
    }
}

// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $database = new Database();
    $db = $database->getConnection();
    $handler = new ResetPasswordHandler($db);

    // Check if this is a token verification request
    if (isset($data['action']) && $data['action'] === 'verify') {
        if (!isset($data['token']) || empty(trim($data['token']))) {
            echo json_encode([
                'success' => false,
                'valid' => false,
                'message' => 'Token is required.'
            ]);
            exit;
        }

        $result = $handler->verifyToken($data['token']);
        echo json_encode($result);
        exit;
    }

    // Password reset request
    if (!isset($data['token']) || empty(trim($data['token']))) {
        echo json_encode([
            'success' => false,
            'message' => 'Reset token is required.'
        ]);
        exit;
    }

    if (!isset($data['password']) || empty(trim($data['password']))) {
        echo json_encode([
            'success' => false,
            'message' => 'New password is required.'
        ]);
        exit;
    }

    if (!isset($data['confirmPassword']) || $data['password'] !== $data['confirmPassword']) {
        echo json_encode([
            'success' => false,
            'message' => 'Passwords do not match.'
        ]);
        exit;
    }

    $result = $handler->resetPassword($data['token'], $data['password']);
    echo json_encode($result);

} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
}
