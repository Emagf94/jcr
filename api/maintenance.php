<?php
require_once 'db_connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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
    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}

function handleGet($conn) {
    if (!isset($_GET['moto_id'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Moto ID required"]);
        return;
    }

    $moto_id = $conn->real_escape_string($_GET['moto_id']);
    
    // Get records
    $sql = "SELECT * FROM maintenance_records WHERE motorcycle_id = '$moto_id' ORDER BY service_date DESC";
    $result = $conn->query($sql);
    
    $records = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            // Fetch photos for each record
            $m_id = $row['id'];
            $p_sql = "SELECT file_path FROM maintenance_photos WHERE maintenance_id = '$m_id'";
            $p_result = $conn->query($p_sql);
            $photos = [];
            while($p_row = $p_result->fetch_assoc()) {
                $photos[] = $p_row['file_path'];
            }
            $row['photos'] = $photos;
            $records[] = $row;
        }
    }
    echo json_encode(["status" => "success", "data" => $records]);
}

function handlePost($conn) {
    // Check if it's a JSON request or Form Data
    $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
    
    if (strpos($contentType, 'application/json') !== false) {
        $data = json_decode(file_get_contents("php://input"), true);
    } else {
        $data = $_POST;
    }

    $required = ['motorcycle_id', 'service_type', 'description'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Faltan campos requeridos: $field"]);
            return;
        }
    }

    $motorcycle_id = $conn->real_escape_string($data['motorcycle_id']);
    $service_type = $conn->real_escape_string($data['service_type']);
    $description = $conn->real_escape_string($data['description']);
    $mileage = (isset($data['mileage']) && $data['mileage'] !== '') ? "'" . $conn->real_escape_string($data['mileage']) . "'" : "NULL";
    $cost = isset($data['cost']) ? $conn->real_escape_string($data['cost']) : '0';
    $mechanic_notes = isset($data['mechanic_notes']) ? $conn->real_escape_string($data['mechanic_notes']) : '';
    $mechanic_name = isset($data['mechanic_name']) ? $conn->real_escape_string($data['mechanic_name']) : 'N/A';

    $sql = "INSERT INTO maintenance_records (
        motorcycle_id, service_type, description, mileage, cost, mechanic_notes, mechanic_name
    ) VALUES (
        '$motorcycle_id', '$service_type', '$description', $mileage, '$cost', '$mechanic_notes', '$mechanic_name'
    )";

    if ($conn->query($sql) === TRUE) {
        $maintenance_id = $conn->insert_id;
        
        // Handle File Uploads
        if (isset($_FILES['photos'])) {
            $upload_dir = '../uploads/maintenance/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $count = count($_FILES['photos']['name']);
            for ($i = 0; $i < $count; $i++) {
                if ($_FILES['photos']['error'][$i] === UPLOAD_ERR_OK) {
                    $tmp_name = $_FILES['photos']['tmp_name'][$i];
                    $name = basename($_FILES['photos']['name'][$i]);
                    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
                    $valid_exts = ['jpg', 'jpeg', 'png', 'webp'];
                    
                    if (in_array($ext, $valid_exts)) {
                        $new_name = uniqid() . '.' . $ext;
                        $path = $upload_dir . $new_name;
                        
                        if (move_uploaded_file($tmp_name, $path)) {
                            // Store relative path for frontend access
                            $db_path = 'uploads/maintenance/' . $new_name;
                            $conn->query("INSERT INTO maintenance_photos (maintenance_id, file_path) VALUES ('$maintenance_id', '$db_path')");
                        }
                    }
                }
            }
        }

        echo json_encode(["status" => "success", "message" => "Mantenimiento registrado correcto"]);
    } else {
        http_response_code(400); // Use 400 or 200 to ensure JSON body is delivered
        echo json_encode(["status" => "error", "message" => "Error al registrar: " . $conn->error]);
    }
}
?>
