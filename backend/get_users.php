<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$db_name = "rcc_tracs";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed"]);
    exit;
}

$sql = "SELECT u.id, u.name AS full_name, u.email, 
        CASE 
            WHEN u.department_id = 1 THEN 'Teacher'
            WHEN u.department_id = 2 THEN 'ITS'
            ELSE 'Unknown'
        END AS department,
        CASE 
            WHEN u.role_id = 1 THEN 'Admin'
            WHEN u.role_id = 2 THEN 'Teacher'
            ELSE 'Unknown'
        END AS access
        FROM users u
        ORDER BY u.id DESC";

$result = $conn->query($sql);

$users = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode(["users" => $users]);

$conn->close();
?>
