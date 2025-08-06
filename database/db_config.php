<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "rcc_login"; // ✅ Fixed: added closing quote

$conn = new mysqli($host, $user, $pass, $dbname);

// ✅ Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
