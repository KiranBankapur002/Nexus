// api/create_note.php
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With");

include_once 'config.php';
include_once 'Note.php';

$database = new Database();
$db = $database->getConnection();

$note = new Note($db);
$data = json_decode(file_get_contents("php://input"));

$note->content = $data->content;

if($note->create()) {
    echo json_encode(array("message" => "Note was created."));
} else {
    echo json_encode(array("message" => "Unable to create note."));
}
?>
