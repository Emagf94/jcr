<?php
require_once 'db_connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

switch ($method) {
    case 'GET':
        handleGet($conn);
        break;
    case 'POST':
        handlePost($conn);
        break;
    case 'PUT':
        handlePut($conn);
        break;
    case 'DELETE':
        handleDelete($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}

function handleGet($conn) {
    $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    $sql = "SELECT * FROM inventory";
    
    if ($search) {
        $sql .= " WHERE name LIKE '%$search%' OR sku LIKE '%$search%' OR category LIKE '%$search%'";
    }
    
    $sql .= " ORDER BY name ASC";
    
    $result = $conn->query($sql);
    $items = [];
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
    }
    
    echo json_encode(["status" => "success", "data" => $items]);
}

function handlePost($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $required = ['sku', 'name', 'category', 'buy_price', 'sale_price'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            echo json_encode(["status" => "error", "message" => "Missing field: $field"]);
            return;
        }
    }
    
    $sku = $conn->real_escape_string($data['sku']);
    $name = $conn->real_escape_string($data['name']);
    $category = $conn->real_escape_string($data['category']);
    $brand = isset($data['brand']) ? $conn->real_escape_string($data['brand']) : '';
    $quantity = isset($data['quantity']) ? intval($data['quantity']) : 0;
    $min_stock = isset($data['min_stock']) ? intval($data['min_stock']) : 5;
    $buy_price = floatval($data['buy_price']);
    $sale_price = floatval($data['sale_price']);
    $location = isset($data['location']) ? $conn->real_escape_string($data['location']) : '';
    $description = isset($data['description']) ? $conn->real_escape_string($data['description']) : '';
    
    $sql = "INSERT INTO inventory (sku, name, category, brand, quantity, min_stock, buy_price, sale_price, location, description)
            VALUES ('$sku', '$name', '$category', '$brand', $quantity, $min_stock, $buy_price, $sale_price, '$location', '$description')";
            
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Item created", "id" => $conn->insert_id]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
}

function handlePut($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['id'])) {
        echo json_encode(["status" => "error", "message" => "ID required"]);
        return;
    }
    
    $id = intval($data['id']);
    $fields = [];
    
    if (isset($data['name'])) $fields[] = "name = '" . $conn->real_escape_string($data['name']) . "'";
    if (isset($data['category'])) $fields[] = "category = '" . $conn->real_escape_string($data['category']) . "'";
    if (isset($data['brand'])) $fields[] = "brand = '" . $conn->real_escape_string($data['brand']) . "'";
    if (isset($data['quantity'])) $fields[] = "quantity = " . intval($data['quantity']);
    if (isset($data['min_stock'])) $fields[] = "min_stock = " . intval($data['min_stock']);
    if (isset($data['buy_price'])) $fields[] = "buy_price = " . floatval($data['buy_price']);
    if (isset($data['sale_price'])) $fields[] = "sale_price = " . floatval($data['sale_price']);
    if (isset($data['location'])) $fields[] = "location = '" . $conn->real_escape_string($data['location']) . "'";
    if (isset($data['description'])) $fields[] = "description = '" . $conn->real_escape_string($data['description']) . "'";
    
    if (empty($fields)) {
        echo json_encode(["status" => "warning", "message" => "No fields to update"]);
        return;
    }
    
    $sql = "UPDATE inventory SET " . implode(', ', $fields) . " WHERE id=$id";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Item updated"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
}

function handleDelete($conn) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if ($id <= 0) {
        echo json_encode(["status" => "error", "message" => "Invalid ID"]);
        return;
    }
    
    $sql = "DELETE FROM inventory WHERE id=$id";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Item deleted"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
}
?>
