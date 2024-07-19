<?php
session_start();

function getGameState() {
    if (!isset($_SESSION['gameState'])) {
        $_SESSION['gameState'] = [
            'boardState' => array_fill(0, 9, null),
            'currentPlayer' => 'X',
            'scoreX' => 0,
            'scoreO' => 0,
            'draws' => 0,
            'totalScore' => 0,
            'roundCount' => 0,
            'maxRounds' => 3,
        ];
        
    }
    return $_SESSION['gameState'];
}

function updateGameState($data) {
    $_SESSION['gameState'] = array_merge($_SESSION['gameState'], $data);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(getGameState());
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    updateGameState($data);
    echo json_encode(['success' => true]);
}
?>
