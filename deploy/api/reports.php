<?php
require_once 'db_connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_GET['start']) || !isset($_GET['end'])) {
    echo json_encode(["status" => "error", "message" => "Dates required"]);
    return;
}

$start = $conn->real_escape_string($_GET['start']);
$end = $conn->real_escape_string($_GET['end']); 
// Append time to end date to cover the full day
$end_full = $end . ' 23:59:59';

// 1. Mechanic Stats
$sqlStats = "SELECT mechanic_name, COUNT(*) as jobs_count, SUM(cost) as total_revenue 
             FROM maintenance_records 
             WHERE service_date BETWEEN '$start' AND '$end_full' 
             GROUP BY mechanic_name 
             ORDER BY total_revenue DESC";

$statsResult = $conn->query($sqlStats);
$stats = [];
while($row = $statsResult->fetch_assoc()) {
    $stats[] = $row;
}

// 2. Detailed List
$sqlDetails = "SELECT service_date, service_type, description, mechanic_name, cost, mileage 
               FROM maintenance_records 
               WHERE service_date BETWEEN '$start' AND '$end_full' 
               ORDER BY service_date DESC";

$detailsResult = $conn->query($sqlDetails);
$details = [];
while($row = $detailsResult->fetch_assoc()) {
    $details[] = $row;
}

echo json_encode([
    "status" => "success",
    "stats" => $stats,
    "details" => $details
]);
?>
