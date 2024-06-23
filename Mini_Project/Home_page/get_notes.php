<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "notes_app";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => $conn->connect_error]));
}

$sql = "SELECT content FROM notes";
$result = $conn->query($sql);

$notes = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $notes[] = $row['content'];
    }
}

$conn->close();

echo json_encode(['notes' => $notes]);
?>
