<?php
session_start();

function getGameState() {
    $response = [
        'success' => true,
        'boardState' => isset($_SESSION['boardState']) ? $_SESSION['boardState'] : array_fill(0, 9, null),
        'scoreX' => isset($_SESSION['scoreX']) ? $_SESSION['scoreX'] : 0,
        'scoreO' => isset($_SESSION['scoreO']) ? $_SESSION['scoreO'] : 0,
        'gameResult' => isset($_SESSION['gameResult']) ? $_SESSION['gameResult'] : null
    ];

    echo json_encode($response);
}

function makeMove($index, $player) {
    if (!isset($_SESSION['boardState'])) {
        $_SESSION['boardState'] = array_fill(0, 9, null);
    }

    if (!in_array($_SESSION['boardState'][$index], ['X', 'O'])) {
        $_SESSION['boardState'][$index] = $player;
        
        $winner = checkWinner();
        if ($winner) {
            updateScore($winner);
            $_SESSION['gameResult'] = $winner === 'X' ? "Player X wins!" : "Player O wins!";
            resetBoard();
        } else if (checkDraw()) {
            $_SESSION['gameResult'] = "It's a draw!";
            resetBoard();
        } else {
            $_SESSION['gameResult'] = null;
        }
    }
  


    echo json_encode([
        'success' => true,
        'boardState' => $_SESSION['boardState'],
        'gameResult' => $_SESSION['gameResult']
    ]);
}

function computerMove() {
    if (!isset($_SESSION['boardState'])) {
        $_SESSION['boardState'] = array_fill(0, 9, null);
    }

    $availableCells = array_keys(array_filter($_SESSION['boardState'], fn($cell) => $cell === null));
    if (!empty($availableCells)) {
        $randomIndex = $availableCells[array_rand($availableCells)];
        $_SESSION['boardState'][$randomIndex] = 'O';


        $winner = checkWinner();
        if ($winner) {
            updateScore($winner);
            $_SESSION['gameResult'] = "Player O wins!";
            resetBoard();
        } else if (checkDraw()) {
            $_SESSION['gameResult'] = "It's a draw!";
            resetBoard();
        } else {
            $_SESSION['gameResult'] = null;
        }
    }

    echo json_encode([
        'success' => true,
        'boardState' => $_SESSION['boardState'],
        'gameResult' => $_SESSION['gameResult']
    ]);
}


function resetGame() {
    $_SESSION['boardState'] = array_fill(0, 9, null);
    $_SESSION['gameResult'] = null;
}

function updateScore($winner) {
    if ($winner === 'X') {
        $_SESSION['scoreX'] = isset($_SESSION['scoreX']) ? $_SESSION['scoreX'] + 10 : 10;
    } else {
        $_SESSION['scoreO'] = isset($_SESSION['scoreO']) ? $_SESSION['scoreO'] + 10 : 10;
    }

    
    if ($_SESSION['scoreX'] >= 30 || $_SESSION['scoreO'] >= 30) {
        updateLeaderboard();
        resetGame();

    }
}

function updateLeaderboard() {
    if (!isset($_SESSION['leaderboard'])) {
        $_SESSION['leaderboard'] = array_fill(0, 10, ['name' => '', 'score' => 0]);
    }

    $newScore = max($_SESSION['scoreX'], $_SESSION['scoreO']);
    $leaderboard = $_SESSION['leaderboard'];
    $leaderboard[] = ['name' => '', 'score' => $newScore];
    usort($leaderboard, fn($a, $b) => $b['score'] - $a['score']);
    $_SESSION['leaderboard'] = array_slice($leaderboard, 0, 10);
}


function checkWinner() {
    $winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    foreach ($winningCombinations as $combination) {
        [$a, $b, $c] = $combination;
        if ($_SESSION['boardState'][$a] && $_SESSION['boardState'][$a] === $_SESSION['boardState'][$b] && $_SESSION['boardState'][$a] === $_SESSION['boardState'][$c]) {
            return $_SESSION['boardState'][$a];
        }
    }
    return null;
}

function checkDraw() {
    return !in_array(null, $_SESSION['boardState']);
}

$action = $_GET['action'] ?? '';
switch ($action) {
    case 'get_game_state':
        getGameState();
        break;
    case 'make_move':
        $data = json_decode(file_get_contents('php://input'), true);
        makeMove($data['index'], $data['player']);
        break;
    case 'computer_move':
        computerMove();
        break;
    case 'reset_game':
        resetGame();
        break;
    case 'get_leaderboard':
        echo json_encode([
            'success' => true,
            'leaderboard' => isset($_SESSION['leaderboard']) ? $_SESSION['leaderboard'] : array_fill(0, 10, ['name' => '', 'score' => 0])
        ]);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}
?>
