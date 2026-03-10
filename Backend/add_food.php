<?php

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

// 🚨 Stop if empty data
if(empty($data) || empty($data['foodName'])){
    echo json_encode(["status"=>"error","message"=>"Invalid data"]);
    exit;
}

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

$sql = "INSERT INTO foods
(category, food_name, is_vegetarian,
serving_quantity, serving_unit,
calories, protein, carbs, fat, created_at)
VALUES
('$category','$food_name','$is_vegetarian',
'$serving_quantity','$serving_unit',
'$calories','$protein','$carbs','$fat','$date')";

$result = mysqli_query($conn, $sql);

if ($result) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
}

mysqli_close($conn);
?>