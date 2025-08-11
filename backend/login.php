<?php
// Enable error reporting for debugging (disable in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method. POST required."
    ]);
    exit();
}

// Include database config
require_once("../database/db_config.php");

// Include PHPMailer classes
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Get JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Fallback for form-data
if (!$data) {
    $data = $_POST;
}

// Validate input
if (empty($data['email']) || empty($data['password'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing email or password."
    ]);
    exit();
}

$email = $data['email'];
$password = $data['password'];

// Fetch user by email
$stmt = $conn->prepare("SELECT id, email, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    // Check password (supports both plain text and hashed)
    $passwordMatch = password_verify($password, $user['password']) || $password === $user['password'];

    if ($passwordMatch) {
        // Generate OTP
        $otp = rand(100000, 999999);
        $expiresAt = date("Y-m-d H:i:s", strtotime("+5 minutes"));

        // Store OTP in DB
        $otpStmt = $conn->prepare("INSERT INTO user_otps (user_id, otp_code, expires_at) VALUES (?, ?, ?)");
        $otpStmt->bind_param("iss", $user['id'], $otp, $expiresAt);
        $otpStmt->execute();
        $otpStmt->close();

        // Send OTP via Gmail
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->SMTPSecure = 'tls';
            $mail->Port       = 587;

            // Get Gmail credentials
            $credStmt = $conn->prepare("SELECT email, app_password FROM gmail_credentials LIMIT 1");
            $credStmt->execute();
            $credResult = $credStmt->get_result();

            if ($cred = $credResult->fetch_assoc()) {
                $mail->Username = $cred['email'];
                $mail->Password = $cred['app_password'];
                $mail->setFrom($cred['email'], 'RCC TRACS');
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Gmail credentials not found in database"
                ]);
                exit();
            }
            $credStmt->close();

            // Email body
            $mail->addAddress($user['email']);
            $mail->isHTML(true);
            $mail->Subject = 'Your OTP Code';
            $mail->Body    = "<h2>Your OTP Code</h2><p><strong>$otp</strong></p><p>This will expire in 5 minutes.</p>";

            $mail->send();

            echo json_encode([
                "success" => true,
                "message" => "OTP sent to email",
                "userId"  => $user['id']
            ]);

        } catch (Exception $e) {
            echo json_encode([
                "success" => false,
                "message" => "Failed to send OTP: " . $mail->ErrorInfo
            ]);
        }

    } else {
        echo json_encode([
            "success" => false,
            "message" => "Incorrect password"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);
}

// Cleanup
$stmt->close();
$conn->close();
?>
<?php