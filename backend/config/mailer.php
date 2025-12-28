<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';

// Load environment variables using Dotenv
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

function getMailer() {
    $mail = new PHPMailer(true);
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    
    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host       = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['SMTP_USER'] ?? '';
        $mail->Password   = $_ENV['SMTP_PASS'] ?? '';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = $_ENV['SMTP_PORT'] ?? 465;

        //Default Sender
        $fromEmail = $_ENV['SMTP_FROM_EMAIL'] ?? 'no-reply@gymnazo.edu.ph';
        $fromName = $_ENV['SMTP_FROM_NAME'] ?? 'Gymnazo Christian Academy';
        
        // Strip quotes if they exist in the env variable
        $fromName = trim($fromName, '"\'');

        $mail->setFrom($fromEmail, $fromName);
        $mail->addReplyTo($fromEmail, $fromName);

        return $mail;
    } catch (Exception $e) {
        error_log("Mailer Configuration Error: " . $e->getMessage());
        throw $e;
    }
}