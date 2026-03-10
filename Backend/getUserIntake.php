<?php

include "db.php";

$user_id = $_GET['user_id'];

$sql = "SELECT 
        intake_history.id,
        foods.food_name,
        foods.category,
        intake_history.serving_Display,
        intake_history.calories,
        intake_history.protein,
        intake_history.carbs,
        intake_history.fat,
        intake_history.created_at
        FROM intake_history
        JOIN foods ON foods.food_id = intake_history.food_id
        WHERE intake_history.user_id = '$user_id'
        ORDER BY intake_history.id DESC";

$result = mysqli_query($conn, $sql);

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);
mysqli_close($conn);
?>