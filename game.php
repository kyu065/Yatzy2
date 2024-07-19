<?php
session_start();

// Initialize game state if not set
if (!isset($_SESSION['gameState'])) {
    $_SESSION['gameState'] = [
        'currentPlayer' => 'X',
        'boardState' => array_fill(0, 9, null),
        'scoreX' => 0,
        'scoreO' => 0,
        'draws' => 0,
        'totalScore' => 0,
        'roundCount' => 0
    ];
}

// Initialize leaderboard if not set
if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = array_fill(0, 10, 0);
}

// Handle POST requests to update game state
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['boardState'])) {
        $_SESSION['gameState']['boardState'] = $data['boardState'];
    }

    if (isset($data['currentPlayer'])) {
        $_SESSION['gameState']['currentPlayer'] = $data['currentPlayer'];
    }

    if (isset($data['scoreX'])) {
        $_SESSION['gameState']['scoreX'] = $data['scoreX'];
    }

    if (isset($data['scoreO'])) {
        $_SESSION['gameState']['scoreO'] = $data['scoreO'];
    }

    if (isset($data['draws'])) {
        $_SESSION['gameState']['draws'] = $data['draws'];
    }

    if (isset($data['totalScore'])) {
        $_SESSION['gameState']['totalScore'] = $data['totalScore'];
    }

    if (isset($data['roundCount'])) {
        $_SESSION['gameState']['roundCount'] = $data['roundCount'];
    }

    if (isset($data['updateLeaderboard']) && $data['updateLeaderboard']) {
        $score = $_SESSION['gameState']['totalScore'];
        $leaderboard = $_SESSION['leaderboard'];
        $leaderboard[] = $score;
        rsort($leaderboard);
        $_SESSION['leaderboard'] = array_slice($leaderboard, 0, 10);
    }

    echo json_encode($_SESSION['gameState']);
    exit;
}

// Handle GET requests to retrieve game state or leaderboard
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['leaderboard'])) {
        echo json_encode($_SESSION['leaderboard']);
    } else {
        echo json_encode($_SESSION['gameState']);
    }
    exit;
}
?>
