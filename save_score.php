<?php
include 'api.php'; // Includes the api.php 

$name = $_POST['name'];
$score = $_POST['score'];

saveScore($name, $score);

echo json_encode([
    'success' => true,
    'scores' => getLeaderboard()
]);
