<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servername = "localhost"; // Usually localhost is best for local scripts
$username = "facnetco_jcr";
$password = "6PVu!7_M0h59-0tF";
$dbname = "facnetco_jcr_db";

// Suppress default PHP errors specifically for connection to handle them gracefully
mysqli_report(MYSQLI_REPORT_OFF);

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    // Return JSON error so frontend doesn't crash
    echo json_encode([
        "status" => "error", 
        "message" => "Database Connection Failed: " . $conn->connect_error
    ]);
    exit();
}

$conn->set_charset("utf8mb4");
