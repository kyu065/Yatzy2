document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("game-board");
    const cells = document.querySelectorAll(".cell");
    const restartButton = document.getElementById("restart");
    const viewLeaderboardButton = document.getElementById("viewLeaderboard");
    const resultDiv = document.getElementById("result");
    const scoreXDisplay = document.getElementById("scoreX");
    const scoreODisplay = document.getElementById("scoreO");
    const drawsDisplay = document.getElementById("draws");
    const totalScoreDisplay = document.getElementById("totalScore");

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

        if (roundCount >= maxRounds) {
            endGame();
        } else {
            roundCount++;
        }
    }

    function updateScore(player) {
        if (player === "X") {
            scoreX++;
            scoreXDisplay.textContent = scoreX;
            totalScore += 10; // Win
        } else if (player === "O") {
            scoreO++;
            scoreODisplay.textContent = scoreO;
            totalScore -= 10; // Loss
        } else if (player === 'Draw') {
            draws++;
            drawsDisplay.textContent = draws;
            totalScore += 5; // Draw
        }
        totalScoreDisplay.textContent = totalScore;
    }

    function endGame() {
        displayResult(`Game Over! Final Score: ${totalScore}`);
        cells.forEach(cell => cell.removeEventListener('click', handleClick)); // Disable further clicks

        // Prompt for player's name and submit score
        const playerName = prompt("Game Over! Enter your name to save your score:");
        if (playerName) {
            submitScore(playerName);
            resetGameState()
        } else {
            resetGameState(); // If no name is entered, reset the game state immediately
        }
    }

    function submitScore(playerName) {
        fetch('save_score.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playerName,
                score: totalScore
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayLeaderboard(data.scores); // Show the leaderboard
                setTimeout(() => {
                    resetGameState(); // Reset game state to initial
                }, 3000); // Adjust the delay as needed
            } else {
                alert("Error saving score!");
                resetGameState(); // Ensure game state is reset even on error
            }
        })
        .catch(error => {
            console.error("Error submitting score:", error);
            alert("Error saving score!");
            resetGameState(); // Ensure game state is reset even on error
        });
    }

    function resetGameState() {
        // Reset scores and round count
        scoreX = 0;
        scoreO = 0;
        draws = 0;
        totalScore = 0;
        roundCount = 0;
        scoreXDisplay.textContent = scoreX;
        scoreODisplay.textContent = scoreO;
        drawsDisplay.textContent = draws;
        totalScoreDisplay.textContent = totalScore;

        // Reset the game board
        resetGame();
    }

    function displayLeaderboard(scores) {
        const leaderboard = document.createElement('div');
        leaderboard.className = 'leaderboard';
        leaderboard.innerHTML = '<h2>Top 10 Scores</h2>' + 
            scores.map(score => `<div>${score.name}: ${score.score}</div>`).join('');
        document.body.appendChild(leaderboard);
    }

    function getScores() {
        fetch('get_scores.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayLeaderboard(data.scores); // Display the leaderboard
                } else {
                    alert("Error retrieving scores!");
                }
            })
            .catch(error => {
                console.error("Error fetching scores:", error);
                alert("Error retrieving scores!");
            });
    }

    // Event listener for leaderboard button
    viewLeaderboardButton.addEventListener('click', () => {
        getScores(); // Fetch scores and display leaderboard
    });

    // Event listener for restart button
    restartButton.addEventListener("click", () => {
        resetGame();
    });

    // Initial setup
    cells.forEach(cell => cell.addEventListener("click", handleClick));
});
