<?php
require_once __DIR__ . '/../../models/User.php';

class AuthController {
    private $db;
    private $user;

    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
    }

    public function login($studentNumber, $password) {
        $userData = $this->user->getStudentByStudentNumber($studentNumber);

        // 1. ichchceck kung may student number ba na galing sa db
        if (!$userData) {
            return ['success' => false, 'message' => 'Invalid username or password.'];
        }

        // 2. ichchceck if active ba yung account
        if ($userData['AccountStatus'] !== 'Active') {
            return ['success' => false, 'message' => 'Account is inactive or suspended. Please contact administration.'];
        }

        if (password_verify($password, $userData['PasswordHash'])) {
            if (session_status() === PHP_SESSION_NONE) {
                // sessiion cookie params for security hell yeah
                session_set_cookie_params([
                    'lifetime' => 3600, // 1 hour lang to lods
                    'path' => '/',
                    'domain' => '', 
                    'secure' => isset($_SERVER['HTTPS']), 
                    'httponly' => true, // Prevent client-side script access
                    'samesite' => 'Lax'
                ]);
                session_start();
            }

            session_regenerate_id(true);
            
            $_SESSION['user_id'] = $userData['UserID'];
            $_SESSION['full_name'] = $userData['FullName'];
            $_SESSION['user_type'] = $userData['UserType'];


            return [
                'success' => true, 
                'message' => 'Login successful!',
                'user' => [
                    'fullName' => $userData['FullName']
                ]
            ];
        } else {
            return ['success' => false, 'message' => 'Invalid username or password.'];
        }
    }
}
?>