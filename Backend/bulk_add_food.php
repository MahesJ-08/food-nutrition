<?php

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['foods']) || empty($data['foods'])) {
    echo json_encode(["error" => "No food data received"]);
    exit;
}

$foods = $data['foods'];

foreach ($foods as $food) {

    $category = $food['category'];
    $food_name = $food['foodName'];
    $is_vegetarian = (strtolower(trim($food['vegetarian'])) === "yes") ? "Yes" : "No";
    $serving_quantity = $food['servingQuantity'];
    $serving_unit = $food['servingUnit'];
    $calories = $food['calories'];
    $protein = $food['protein'];
    $carbs = $food['carbs'];
    $fat = $food['fats'];
    $date = $food['date'];

    $sql = "INSERT INTO foods
    (category, food_name, is_vegetarian,
     serving_quantity, serving_unit,
     calories, protein, carbs, fat, created_at)
    VALUES
    ('$category','$food_name','$is_vegetarian',
     '$serving_quantity','$serving_unit',
     '$calories','$protein','$carbs','$fat','$date')";

    mysqli_query($conn, $sql);
}

echo json_encode(["status" => "Bulk insert successful"]);

mysqli_close($conn);
?>