<?php
session_start();

// Initializing session varaibles if not already set
if (!isset($_SESSION['game'])) {
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
}


// Game state and leaderboard retrieval
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        $action = $_POST['action'];
        switch ($action) {
            case 'resetGame':
                $_SESSION['game'] = [

                    'boardState' => array_fill(0, 9, null),
                    'currentPlayer' => 'X',
                    'scoreX' => 0,
                    'scoreO' => 0,
                    'draws' => 0,
                    'totalScore' => 0,
                    'roundCount' => 0,
                    'maxRounds' => 3,
                    'leaderboard' => $_SESSION['game']['leaderboard']
                ];
                echo json_encode(['success' => true]);
                break;
            case 'getGameState':
                echo json_encode($_SESSION['game']);
                break;
            case 'updateGameState':
                $data = json_decode(file_get_contents('php://input'), true);
                $_SESSION['game'] = array_merge($_SESSION['game'], $data);
                echo json_encode(['success' => true]);
                break;
        }
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tic Tac Toe</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    
    <header>
        <h1>Tic-Tac-Toe</h1>
    </header>
    <main>
        <div class="container">
            <img src="docs/assets/design_system/image.png" alt="Mascot" class="logo">
            <div class="score-board">
                <div>
                    <span>Player X: </span>
                    <span id="scoreX">0</span>
                </div>
                <div>
                    <span>Player O: </span>
                    <span id="scoreO">0</span>
                </div>
                <div>
                    <span>Draws: </span>
                    <span id="draws">0</span>
                </div>
                <div>
                    <span>Total Score: </span>
                    <span id="totalScore">0</span>
                </div>
            </div>
            <div id="game-board" class="board">
                <div class="cell" data-index="0"></div>
                <div class="cell" data-index="1"></div>
                <div class="cell" data-index="2"></div>
                <div class="cell" data-index="3"></div>
                <div class="cell" data-index="4"></div>
                <div class="cell" data-index="5"></div>
                <div class="cell" data-index="6"></div>
                <div class="cell" data-index="7"></div>
                <div class="cell" data-index="8"></div>
            </div>
            <div id="result" class="result"></div>
            <button id="restart">Restart Game</button>
            <button id="viewLeaderboard">View Leaderboard</button>
        </div>
    </main>
    <footer>
        <p>The following is a 3x3 grid game where a player must match 3 symbols horizontally, vertically, or diagonally.</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>
