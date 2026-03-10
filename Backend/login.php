<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$email    = $data['email'];
$password = $data['password'];

if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error"]);
    exit();
}

$sql = "SELECT * FROM users 
        WHERE email='$email' AND password='$password'";

$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {

    $user = mysqli_fetch_assoc($result);

    echo json_encode([
        "status" => "success",
        "user"   => $user
    ]);

} else {

    echo json_encode([
        "status" => "invalid"
    ]);
}

mysqli_close($conn);
?>