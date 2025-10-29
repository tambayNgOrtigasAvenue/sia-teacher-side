<?php
// Adjust the path if necessary.
require_once __DIR__ .  '/../vendor/autoload.php';

// Load the .env file
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();
class Database {
    public $conn;
    
    public function getConnection() {
        $this->conn = null;
        $host = $_ENV['DB_HOST'];
        $db_name = $_ENV['DB_NAME'];
        $username = $_ENV['DB_USER'];
        $password = $_ENV['DB_PASS'];
        try {
            $dsn = "mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8mb4";
            $this->conn = new PDO($dsn, $username, $password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}