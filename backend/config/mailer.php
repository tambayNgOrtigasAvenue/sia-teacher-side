<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/env.php';

function getMailer() {
    $mail = new PHPMailer(true);

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
        $mail->setFrom($_ENV['SMTP_FROM_EMAIL'] ?? 'no-reply@gymnazo.edu.ph', $_ENV['SMTP_FROM_NAME'] ?? 'Gymnazo Christian Academy');

        return $mail;
    } catch (Exception $e) {
        error_log("Mailer Configuration Error: " . $e->getMessage());
        throw $e;
    }
}