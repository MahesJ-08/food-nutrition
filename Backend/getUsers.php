<?php
include 'db.php';

$sql = "SELECT *, user_id, name, email, role FROM users WHERE role='user'";
$result = mysqli_query($conn, $sql);

$users = [];

while ($row = mysqli_fetch_assoc($result)) {
    $users[] = $row;
}

echo json_encode($users);

mysqli_close($conn);
?>