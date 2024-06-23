<?php
header('Content-Type: application/json');

// Assuming you have a function to fetch notes from your database
// Replace this with your actual database connection and query logic
$pdo = new PDO('mysql:host=localhost;dbname=your_database_name', 'username', 'password');
$stmt = $pdo->query('SELECT * FROM notes');
$notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['notes' => $notes]);
?>
