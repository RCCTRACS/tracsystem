<?php
// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set headers for API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

// Include database configuration
require_once("../database/db_config.php");

// Get raw POST data
$data = json_decode(file_get_contents("php://input"), true);

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

// Prepare SQL statement
$stmt = $conn->prepare("SELECT id, email, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Check if user exists
if ($user = $result->fetch_assoc()) {
    // Verify password
    if (password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "userId"  => $user['id']
        ]);
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

// Close connections
$stmt->close();
$conn->close();
?>
