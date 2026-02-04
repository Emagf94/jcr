<?php
require_once 'api/db_connect.php';

$sql = file_get_contents('maintenance_photos.sql');

if ($conn->query($sql)) {
    echo "Maintenance photos table created successfully.";
} else {
    echo "Error creating table: " . $conn->error;
}

$conn->close();
?>
