<?php
include 'db.php';

$id = $_GET['id'];

$sql = "DELETE FROM intake_history WHERE id='$id'";

$result = mysqli_query($conn, $sql);

if ($result) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}

mysqli_close($conn);
?>