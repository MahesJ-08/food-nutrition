<?php

$conn = mysqli_connect("localhost", "root", "", "food_nutrition");

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

?>