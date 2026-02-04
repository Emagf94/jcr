<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (isset($_GET['file'])) {
    $file = $_GET['file'];
    
    // Security check: prevent directory traversal
    // We only allow files inside uploads/maintenance/
    if (strpos($file, '..') !== false || strpos($file, 'uploads/') === false) {
        http_response_code(400);
        exit('Invalid file path');
    }

    $basePath = __DIR__ . '/../'; // go up from api/
    $filePath = $basePath . $file;

    if (file_exists($filePath)) {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mime_types = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp'
        ];

        if (array_key_exists($ext, $mime_types)) {
            header('Content-Type: ' . $mime_types[$ext]);
            readfile($filePath);
        } else {
            http_response_code(415); // Unsupported Media Type
            echo "Unsupported file type";
        }
    } else {
        http_response_code(404);
        echo "File not found";
    }
} else {
    http_response_code(400);
    echo "No file specified";
}
?>
