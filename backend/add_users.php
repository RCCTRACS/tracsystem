<?php
// ==== CORS Headers ====
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Kung OPTIONS request lang, wag na mag-run ng ibang code
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ==== Content Type ====
header("Content-Type: application/json; charset=UTF-8");

// ==== Database Connection ====
$host = "localhost";
$db_name = "rcc_tracs";
$username = "root";
$password = "";
$conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed"]);
    exit();
}

// ==== Get and Validate Data ====
$data = json_decode(file_get_contents("php://input"));

if (
    empty($data->name) ||
    empty($data->email) ||
    empty($data->password) ||
    empty($data->role_id) ||
    empty($data->department_id)
) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
    exit();
}

$name = trim($data->name);
$email = trim($data->email);
$passwordHash = password_hash($data->password, PASSWORD_DEFAULT);
$role_id = (int)$data->role_id;
$department_id = (int)$data->department_id;

// ==== Insert into Database (Prepared Statement) ====
$stmt = $conn->prepare("INSERT INTO users (name, email, password, role_id, department_id) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssii", $name, $email, $passwordHash, $role_id, $department_id);

if ($stmt->execute()) {
    echo json_encode(["message" => "User added successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error adding user", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
