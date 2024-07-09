document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("game-board");
    const cells = document.querySelectorAll(".cell");
    const restartButton = document.getElementById("restart");
    const resultDiv = document.getElementById("result");
    const scoreXD = document.getElementById("scoreX");
    const scoreOD = document.getElementById("scoreO");

    let currentPlayer = "X";
    let boardState = Array(9).fill(null);
    let scoreX = 0;
    let scoreO = 0;
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
    }

    function updateScore(player) {
        if (player === "X") {
            scoreX++;
            scoreXD.textContent = scoreX;
        } else {
            scoreO++;
            scoreOD.textContent = scoreO;
        }
    }

    cells.forEach(cell => cell.addEventListener("click", handleClick));
    restartButton.addEventListener("click", () => {
        resetGame();
        scoreX = 0;
        scoreO = 0;
        scoreXD.textContent = scoreX;
        scoreOD.textContent = scoreO;
    });
});
