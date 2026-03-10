<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$name     = $data['name'];
$email    = $data['email'];
$password = $data['password'];
$role     = "user";

/* Check if email already exists */
$checkSql = "SELECT user_id FROM users WHERE email = '$email'";
$checkResult = mysqli_query($conn, $checkSql);

if (mysqli_num_rows($checkResult) > 0) {
    echo json_encode(["status" => "exists"]);
    exit();
}

/* Insert user */
$sql = "INSERT INTO users (name, email, password, role)
        VALUES ('$name', '$email', '$password', '$role')";

$result = mysqli_query($conn, $sql);

if ($result) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => mysqli_error($conn)
    ]);
}

mysqli_close($conn);
?>