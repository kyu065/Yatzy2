<?php
session_start();

$leaderboard_file = 'leaderboard.json';

// Initialize leaderboard file if it doesn't exist
if (!file_exists($leaderboard_file)) {
    file_put_contents($leaderboard_file, json_encode(array_fill(0, 10, 0)));
}

// Handle incoming AJAX request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['action']) && $data['action'] === 'update') {
        $score = intval($data['score']);
        $scores = json_decode(file_get_contents($leaderboard_file), true);
        $scores[] = $score;
        rsort($scores);
        $scores = array_slice($scores, 0, 10);
        file_put_contents($leaderboard_file, json_encode($scores));
    }
}

// Return leaderboard data
$scores = json_decode(file_get_contents($leaderboard_file), true);
echo json_encode(['scores' => $scores]);
?>
