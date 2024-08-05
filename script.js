document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("game-board");
    const cells = document.querySelectorAll(".cell");
    const restartButton = document.getElementById("restart");
    const resultDiv = document.getElementById("result");
    const scoreXDisplay = document.getElementById("scoreX");
    const scoreODisplay = document.getElementById("scoreO");
    const drawsDisplay = document.getElementById("draws");
    const totalScoreDisplay = document.getElementById("totalScore");
    const leaderboardContainer = document.getElementById("leaderboardContainer");
    const leaderboardDiv = document.getElementById("leaderboard");

    let currentPlayer = "X";
    let boardState = Array(9).fill(null);
    let scoreX = 0;
    let scoreO = 0;
    let draws = 0;
    let totalScore = 0;
    let roundCount = 0;
    const maxRounds = 3;

    const winMap = new Map();

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    winningCombinations.forEach(combination => {
        winMap.set(combination.join(''), combination);
    });

    function checkWinner() {
        for (const [key, combination] of winMap) {
            const [a, b, c] = combination;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                return combination;
            }
        }
        return null;
    }

    function checkDraw() {
        return boardState.every(cell => cell !== null);
    }

    function displayResult(message) {
        resultDiv.textContent = message;
    }

    function handleClick(event) {
        const index = event.target.dataset.index;
        if (!boardState[index]) {
            boardState[index] = currentPlayer;
            event.target.textContent = currentPlayer;
            event.target.classList.add(currentPlayer.toLowerCase());
            const winningCombination = checkWinner();
            if (winningCombination) {
                winningCombination.forEach(idx => {
                    cells[idx].classList.add('winner');
                });
                displayResult(`${currentPlayer === "X" ? "Player" : "Computer"} wins!`);
                updateScore(currentPlayer);
                setTimeout(resetGame, 1500);
                return;
            }
            if (checkDraw()) {
                displayResult("It's a draw!");
                updateScore('Draw');
                setTimeout(resetGame, 1500);
                return;
            }
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            if (currentPlayer === "O") {
                computerMove();
            }
        }
    }

    function computerMove() {
        let availableCells = [];
        boardState.forEach((cell, index) => {
            if (cell === null) {
                availableCells.push(index);
            }
        });
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        boardState[randomIndex] = currentPlayer;
        cells[randomIndex].textContent = currentPlayer;
        cells[randomIndex].classList.add(currentPlayer.toLowerCase());
        const winningCombination = checkWinner();
        if (winningCombination) {
            winningCombination.forEach(idx => {
                cells[idx].classList.add('winner');
            });
            displayResult(`${currentPlayer === "X" ? "Player" : "Computer"} wins!`);
            updateScore(currentPlayer);
            setTimeout(resetGame, 1500);
            return;
        }
        if (checkDraw()) {
            displayResult("It's a draw!");
            updateScore('Draw');
            setTimeout(resetGame, 1500);
            return;
        }
        currentPlayer = "X";
    }

    function resetGame() {
        boardState = Array(9).fill(null);
        cells.forEach(cell => {
            cell.textContent = "";
            cell.className = "cell";
        });
        currentPlayer = "X";
        displayResult("");

        cells.forEach(cell => cell.addEventListener("click", handleClick)); // Reattach event listeners

        roundCount++;
        if (roundCount > maxRounds) {
            roundCount = 1;  // Reset round count
            updateLeaderboard();
        }
    }

    function updateScore(player) {
        if (player === "X") {
            scoreX += 10;
        } else if (player === "O") {
            scoreO += 10;
        } else {
            draws++;
        }
        totalScore = scoreX + scoreO + (draws * 5);
        updateDisplay();
    }

    function updateDisplay() {
        scoreXDisplay.textContent = scoreX;
        scoreODisplay.textContent = scoreO;
        drawsDisplay.textContent = draws;
        totalScoreDisplay.textContent = totalScore;
    }

    function updateLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({ name: 'Player', score: totalScore });

        leaderboard.sort((a, b) => b.score - a.score);

        while (leaderboard.length > 10) {
            leaderboard.pop();
        }

        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        renderLeaderboard(leaderboard);

        // Reset scores after adding to leaderboard
        scoreX = 0;
        scoreO = 0;
        draws = 0;
        totalScore = 0;
        updateDisplay();
    }

    function renderLeaderboard(scores) {
        const leaderboardEntries = leaderboardDiv.querySelectorAll("div");
        scores.forEach((score, index) => {
            if (index < leaderboardEntries.length) {
                leaderboardEntries[index].textContent = `Rank ${index + 1}: ${score.score}`;
            }
        });
    }

    function endGame() {
        displayResult("Game over. Restarting...");
        setTimeout(() => {
            roundCount = 1;
            scoreX = 0;
            scoreO = 0;
            draws = 0;
            totalScore = 0;
            updateDisplay();
            resetGame();
        }, 2000);
    }

    restartButton.addEventListener("click", () => {
        resetGame();
    });

    document.getElementById("viewLeaderboard").addEventListener("click", () => {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        renderLeaderboard(leaderboard);
        leaderboardContainer.style.display = 'block';
    });

    resetGame(); // Initialize the game on page load
});
