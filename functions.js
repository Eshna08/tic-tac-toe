const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');
const messageElement = document.getElementById('message');
const menu = document.getElementById('menu');
const playWithFriendButton = document.getElementById('playWithFriend');
const playWithAIButton = document.getElementById('playWithAI');

const PLAYER_X = 'X';
const PLAYER_O = 'O';
let currentPlayer = PLAYER_X;
let isAgainstAI = false;

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

const startGame = () => {
    cells.forEach(cell => {
        cell.classList.remove(PLAYER_X);
        cell.classList.remove(PLAYER_O);
        cell.textContent = '';  // Clear the text content
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    messageElement.textContent = '';
    currentPlayer = PLAYER_X;
};

const handleClick = (e) => {
    const cell = e.target;
    placeMark(cell, currentPlayer);
    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (isAgainstAI && currentPlayer === PLAYER_O) {
            setTimeout(computerMove, 500);
        }
    }
};

const placeMark = (cell, player) => {
    cell.classList.add(player);
    cell.textContent = player;  // Add text content
};

const swapTurns = () => {
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
};

const checkWin = (player) => {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(player);
        });
    });
};

const isDraw = () => {
    return [...cells].every(cell => {
        return cell.classList.contains(PLAYER_X) || cell.classList.contains(PLAYER_O);
    });
};

const endGame = (draw) => {
    if (draw) {
        messageElement.textContent = 'Draw!';
    } else {
        messageElement.textContent = `${currentPlayer} Wins!`;
    }
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
    restartButton.style.display = 'block';
};

const computerMove = () => {
    const availableCells = [...cells].filter(cell => 
        !cell.classList.contains(PLAYER_X) && !cell.classList.contains(PLAYER_O)
    );
    let bestScore = -Infinity;
    let move;
    availableCells.forEach(cell => {
        cell.classList.add(PLAYER_O);
        cell.textContent = PLAYER_O;
        let score = minimax(cells, 0, false);
        cell.classList.remove(PLAYER_O);
        cell.textContent = '';
        if (score > bestScore) {
            bestScore = score;
            move = cell;
        }
    });
    placeMark(move, PLAYER_O);
    if (checkWin(PLAYER_O)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
};

const minimax = (board, depth, isMaximizing) => {
    if (checkWin(PLAYER_O)) {
        return 1;
    } else if (checkWin(PLAYER_X)) {
        return -1;
    } else if (isDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        cells.forEach(cell => {
            if (!cell.classList.contains(PLAYER_X) && !cell.classList.contains(PLAYER_O)) {
                cell.classList.add(PLAYER_O);
                cell.textContent = PLAYER_O;
                let score = minimax(board, depth + 1, false);
                cell.classList.remove(PLAYER_O);
                cell.textContent = '';
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        cells.forEach(cell => {
            if (!cell.classList.contains(PLAYER_X) && !cell.classList.contains(PLAYER_O)) {
                cell.classList.add(PLAYER_X);
                cell.textContent = PLAYER_X;
                let score = minimax(board, depth + 1, true);
                cell.classList.remove(PLAYER_X);
                cell.textContent = '';
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
};

const showBoard = () => {
    menu.style.display = 'none';
    board.style.display = 'grid';
    restartButton.style.display = 'block';
    startGame();
};

playWithFriendButton.addEventListener('click', () => {
    isAgainstAI = false;
    showBoard();
});

playWithAIButton.addEventListener('click', () => {
    isAgainstAI = true;
    showBoard();
});

restartButton.addEventListener('click', startGame);
