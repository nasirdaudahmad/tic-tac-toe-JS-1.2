// Initialize the game borad
const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('game-status');
const resetBtn = document.getElementById('reset-btn');
const twoPlayerBtn = document.getElementById('two-player-mode');
const computerModeBtn = document.getElementById('computer-mode');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let vsComputer = true;
gameStatus.textContent = "Your turn";
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Handle Cell Clicks
function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (board[index] !== '' || !isGameActive) return; //Disable clicks when game is over.

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin()) {
    gameStatus.textContent = `${currentPlayer} has won!`;
    isGameActive = false;
  } else if (board.every(cell => cell !== '')) {
    gameStatus.textContent = 'It\'s a draw!';
    isGameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = currentPlayer == 'X' ? 'Your turn' : "Computer's turn";

    if (vsComputer && currentPlayer === 'O') {
      setTimeout(computerMove, 500);  // Delay for realism
    }
  }
}

// Unbeatable computer move (Minimax algorithm)
function computerMove() {
  const bestMove = minimax(board, 'O');
  board[bestMove.index] = 'O';
  cells[bestMove.index].textContent = 'O';

  if (checkWin()) {
    gameStatus.textContent = `Computer has won!`;
    isGameActive = false;
  } else if (board.every(cell => cell !== '')) {
    gameStatus.textContent = 'It\'s a draw!';
    isGameActive = false;
  } else {
    currentPlayer = 'X';
    gameStatus.textContent = currentPlayer == 'X' ? 'Your turn' : "Computer's turn";
  }
}

// Minimax algorithm
function minimax(newBoard, player) {
  // Get available spots
  let availableSpots = newBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);

  // Check for terminal states (win, lose, draw)
  if (checkWinFor(newBoard, 'X')) return { score: -10 };
  if (checkWinFor(newBoard, 'O')) return { score: 10 };
  if (availableSpots.length === 0) return { score: 0 };

  // Collect all the moves
  let moves = [];
  for (let i = 0; i < availableSpots.length; i++) {
    let move = {};
    move.index = availableSpots[i];

    newBoard[availableSpots[i]] = player;

    if (player === 'O') {
      let result = minimax(newBoard, 'X');
      move.score = result.score;
    } else {
      let result = minimax(newBoard, 'O');
      move.score = result.score;
    }

    newBoard[availableSpots[i]] = '';  // Undo move
    moves.push(move);
  }

  // Choose the best move
  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  }
  return bestMove;
}

// Helper function to check if someone has won in minimax
function checkWinFor(board, player) {
  return winningConditions.some(combination => {
    return combination.every(index => board[index] === player);
  });
}

// Check if the current player has won
function checkWin() {
  return winningConditions.some(combination => {
    return combination.every(index => board[index] === currentPlayer);
  });
}

// Reset Game
function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => cell.textContent = '');
  currentPlayer = 'X';
  isGameActive = true;
  gameStatus.textContent =  currentPlayer == 'X' ? 'Your turn' : "Computer's turn";
}

// Switch to Two Player Mode
function startTwoPlayerGame() {
  vsComputer = false;
  resetGame();
}

// Switch to Player vs. Computer Mode
function startComputerGame() {
  vsComputer = true;
  resetGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
twoPlayerBtn.addEventListener('click', startTwoPlayerGame);
computerModeBtn.addEventListener('click', startComputerGame);
