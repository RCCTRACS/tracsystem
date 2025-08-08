<?php
require_once("../database/db_config.php");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['email']) || empty($data['otp'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing email or OTP."
    ]);
    exit();
}

$email = $data['email'];
$otp = $data['otp'];

// First get user ID by email
$userStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$userStmt->bind_param("s", $email);
$userStmt->execute();
$userResult = $userStmt->get_result();

if ($userResult->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "User not found."
    ]);
    exit();
}

$user = $userResult->fetch_assoc();
$userId = $user['id'];

$stmt = $conn->prepare("
    SELECT * FROM user_otps 
    WHERE user_id = ? AND otp_code = ? AND expires_at > NOW() 
    ORDER BY created_at DESC LIMIT 1
");
$stmt->bind_param("is", $userId, $otp);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => true,
        "message" => "OTP verified successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid or expired OTP"
    ]);
}

$stmt->close();
$conn->close();
?>
