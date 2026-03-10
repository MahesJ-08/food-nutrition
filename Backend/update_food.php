<?php

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$food_id = $data['food_id'];
$category = $data['category'];
$food_name = $data['foodName'];
$is_vegetarian = (strtolower(trim($data['vegetarian'])) === "yes") ? "Yes" : "No";
$serving_quantity = $data['servingQuantity'];
$serving_unit = $data['servingUnit'];
$calories = $data['calories'];
$protein = $data['protein'];
$carbs = $data['carbs'];
$fat = $data['fats'];
$date = $data['date'];

$sql = "UPDATE foods SET
    category='$category',
    food_name='$food_name',
    is_vegetarian='$is_vegetarian',
    serving_quantity='$serving_quantity',
    serving_unit='$serving_unit',
    calories='$calories',
    protein='$protein',
    carbs='$carbs',
    fat='$fat',
    created_at='$date'
WHERE food_id='$food_id'";

$result = mysqli_query($conn, $sql);

if ($result) {
    echo json_encode(["status" => "updated"]);
} else {
    echo json_encode(["error" => mysqli_error($conn)]);
}

mysqli_close($conn);
?>