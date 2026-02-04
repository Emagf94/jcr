<?php
require_once 'db_connect.php';

// Create Sales Table
$sql = "CREATE TABLE IF NOT EXISTS sales (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT(11) UNSIGNED NOT NULL,
    quantity INT(11) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    sold_by VARCHAR(100),
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES inventory(id)
)";

if ($conn->query($sql) === TRUE) {
    echo "Table 'sales' created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$conn->close();
?>
