<?php

include "db.php";

$sql = "SELECT * FROM foods ORDER BY food_id DESC";
$result = mysqli_query($conn, $sql);

$foods = [];

while ($row = mysqli_fetch_assoc($result)) {
    $foods[] = $row;
}

echo json_encode($foods);

mysqli_close($conn);
?>