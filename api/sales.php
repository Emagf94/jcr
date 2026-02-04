<?php
require_once 'db_connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT s.*, i.name as product_name, i.sku 
            FROM sales s 
            JOIN inventory i ON s.product_id = i.id 
            ORDER BY s.sale_date DESC";
    
    $result = $conn->query($sql);
    $sales = [];
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $sales[] = $row;
        }
    }
    
    echo json_encode(["status" => "success", "data" => $sales]);
}
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Validate inputs
    if (!isset($data['product_id']) || !isset($data['quantity'])) {
        echo json_encode(["status" => "error", "message" => "Missing data"]);
        return;
    }

    $product_id = intval($data['product_id']);
    $quantity = intval($data['quantity']);
    $sold_by = isset($data['sold_by']) ? $conn->real_escape_string($data['sold_by']) : 'Unknown';

    // 1. Check Inventory
    $checkSql = "SELECT quantity, sale_price FROM inventory WHERE id = $product_id";
    $result = $conn->query($checkSql);
    
    if ($result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "Product not found"]);
        return;
    }
    
    $item = $result->fetch_assoc();
    $current_stock = intval($item['quantity']);
    $unit_price = floatval($item['sale_price']);
    
    if ($current_stock < $quantity) {
        echo json_encode(["status" => "error", "message" => "Insufficient stock. Available: $current_stock"]);
        return;
    }

    // 2. Transact
    $conn->begin_transaction();
    
    try {
        // Update Inventory
        $new_qty = $current_stock - $quantity;
        if (!$conn->query("UPDATE inventory SET quantity = $new_qty WHERE id = $product_id")) {
            throw new Exception("Stock update failed");
        }
        
        // Record Sale
        $total_price = $quantity * $unit_price;
        $insertSql = "INSERT INTO sales (product_id, quantity, unit_price, total_price, sold_by) 
                      VALUES ($product_id, $quantity, $unit_price, $total_price, '$sold_by')";
        
        if (!$conn->query($insertSql)) {
            throw new Exception("Sale recording failed");
        }
        
        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Sale completed"]);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>
