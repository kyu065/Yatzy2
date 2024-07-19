<?php
session_start();

$_SESSION['game'] = [
    'boardState' => array_fill(0, 9, null),
    'currentPlayer' => 'X',
    'scoreX' => 0,
    'scoreO' => 0,
    'draws' => 0,
    'totalScore' => 0,
    'roundCount' => 0,
    'maxRounds' => 3,
    'leaderboard' => array_fill(0, 10, ['name' => 'Empty', 'score' => 0])
];

echo json_encode(['success' => true]);
