// api/read_notes.php
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once 'config.php';
include_once 'Note.php';

$database = new Database();
$db = $database->getConnection();

$note = new Note($db);
$stmt = $note->read();
$num = $stmt->rowCount();

if($num > 0) {
    $notes_arr = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $note_item = array(
            "id" => $id,
            "content" => $content,
            "created_at" => $created_at
        );
        array_push($notes_arr, $note_item);
    }
    echo json_encode($notes_arr);
} else {
    echo json_encode(array());
}
?>
