<?php

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$food_id = $data['food_id'];

$sql = "DELETE FROM foods WHERE food_id='$food_id'";
$result = mysqli_query($conn, $sql);

if ($result) {
    echo json_encode(["status" => "deleted"]);
} else {
    echo json_encode(["error" => mysqli_error($conn)]);
}

mysqli_close($conn);
?>