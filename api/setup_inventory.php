<?php
require_once 'db_connect.php';

$sql = "CREATE TABLE IF NOT EXISTS inventory (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(50),
    quantity INT(11) DEFAULT 0,
    min_stock INT(11) DEFAULT 5,
    buy_price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) NOT NULL,
    location VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table 'inventory' created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$conn->close();
?>
