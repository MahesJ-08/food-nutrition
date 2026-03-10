<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status"=>"error","message"=>"No data received"]);
    exit;
}

$user_id = $data['user_id'];
$food_id = $data['food_id'];
$serving_Display = $data['serving_Display'];
$calories = $data['calories'];
$protein = $data['protein'];
$carbs = $data['carbs'];
$fat = $data['fat'];

$sql = "INSERT INTO intake_history 
        (user_id, food_id, serving_Display, calories, protein, carbs, fat)
        VALUES 
        ('$user_id', '$food_id', '$serving_Display', '$calories', '$protein', '$carbs', '$fat')";

$result = mysqli_query($conn, $sql);

if ($result) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}

mysqli_close($conn);
?>