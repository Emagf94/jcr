<?php
require_once 'db_connect.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet($conn);
        break;
    case 'POST':
        handlePost($conn);
        break;
    case 'OPTIONS':
        http_response_code(200);
        break;
    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}


function handleGet($conn) {
    // Error handling to prevent HTML output breaking JSON
    error_reporting(E_ALL);
    ini_set('display_errors', 0);

    $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    
    $sql = "SELECT * FROM motorcycles";
    if ($search) {
        $sql .= " WHERE license_plate LIKE '%$search%' OR owner_name LIKE '%$search%' OR owner_id LIKE '%$search%'";
    }
    // Changed to id to prevent errors if created_at doesn't exist
    $sql .= " ORDER BY id DESC";

    $result = $conn->query($sql);
    
    if (!$result) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "SQL Error: " . $conn->error]);
        return;
    }
    
    $motorcycles = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $motorcycles[] = $row;
        }
    }
    echo json_encode(["status" => "success", "data" => $motorcycles]);
}

function handlePost($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Required fields based on image check
    $required = ['brand', 'license_plate', 'owner_name', 'owner_id'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Faltan campos requeridos: $field"]);
            return;
        }
    }

    $owner_name = $conn->real_escape_string($data['owner_name']);
    $owner_id = $conn->real_escape_string($data['owner_id']);
    $owner_address = isset($data['owner_address']) ? $conn->real_escape_string($data['owner_address']) : '';
    $owner_email = isset($data['owner_email']) ? $conn->real_escape_string($data['owner_email']) : '';
    $owner_phone = isset($data['owner_phone']) ? $conn->real_escape_string($data['owner_phone']) : '';
    $owner_mobile = isset($data['owner_mobile']) ? $conn->real_escape_string($data['owner_mobile']) : '';
    
    $brand = $conn->real_escape_string($data['brand']);
    $type = isset($data['type']) ? $conn->real_escape_string($data['type']) : '';
    $license_plate = $conn->real_escape_string($data['license_plate']);
    $model = isset($data['model']) ? $conn->real_escape_string($data['model']) : '';
    $soat_expiry = isset($data['soat_expiry']) ? $conn->real_escape_string($data['soat_expiry']) : NULL;
    $technomechanical_expiry = isset($data['technomechanical_expiry']) ? $conn->real_escape_string($data['technomechanical_expiry']) : NULL;

    // Handle NULL dates safely
    $soat_val = $soat_expiry ? "'$soat_expiry'" : "NULL";
    $tech_val = $technomechanical_expiry ? "'$technomechanical_expiry'" : "NULL";

    $sql = "INSERT INTO motorcycles (
        owner_name, owner_id, owner_address, owner_email, owner_phone, owner_mobile,
        brand, type, license_plate, model, soat_expiry, technomechanical_expiry
    ) VALUES (
        '$owner_name', '$owner_id', '$owner_address', '$owner_email', '$owner_phone', '$owner_mobile',
        '$brand', '$type', '$license_plate', '$model', $soat_val, $tech_val
    )";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Moto registrada correctamente", "id" => $conn->insert_id]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Error al registrar: " . $conn->error]);
    }
}
?>
