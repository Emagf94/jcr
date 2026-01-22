<?php
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->username) || !isset($data->password)) {
        echo json_encode(["status" => "error", "message" => "Por favor completa todos los campos"]);
        exit();
    }

    $username = $conn->real_escape_string($data->username);
    $password = $data->password;

    $sql = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            // Success
            // In a real app, generate JWT or session
            echo json_encode([
                "status" => "success", 
                "message" => "Inicio de sesión exitoso",
                "user" => [
                    "id" => $row['id'],
                    "username" => $row['username'],
                    "full_name" => $row['full_name'],
                    "role" => $row['role'] // Important for frontend permissions
                ]
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Credenciales inválidas"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Método de solicitud inválido"]);
}

$conn->close();
?>
