// api/delete_note.php
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With");

include_once 'config.php';
include_once 'Note.php';

$database = new Database();
$db = $database->getConnection();

$note = new Note($db);
$data = json_decode(file_get_contents("php://input"));

$note->id = $data->id;

if($note->delete()) {
    echo json_encode(array("message" => "Note was deleted."));
} else {
    echo json_encode(array("message" => "Unable to delete note."));
}
?>
