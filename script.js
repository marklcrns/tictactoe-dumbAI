/* with easy AI generating random moves */

var origBoard;
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  // horizontals
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // verticals
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonals
  [0, 4, 8],
  [2, 4, 6]
];

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  // before starting...
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    // remove background color
    cells[i].style.removeProperty("background-color");
    // get the cell id everytime a cell is clicked
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  // prevent from selecting the same cell
  if (typeof origBoard[square.target.id] == "number") {
    turn(square.target.id, huPlayer);
    // if not tie and huPlayer hasn't won, ai take a turn
    if (!checkTie(huPlayer) && !checkWin(origBoard, huPlayer))
      turn(randomEmptySpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  // input marker (player) in the square
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  // win check
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  // a = accumulator, e = element, i = index
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      // stores the winning player index and marker
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  // paint all winCombos squares with color
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "rgb(104, 222, 134)" : "rgb(222, 104, 120)";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return origBoard.filter(s => typeof s == "number");
}

function randomEmptySpot() {
  // generates random empty spot
  var emptyCells = emptySquares();
  var randomNum = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomNum];
}

function checkTie(player) {
  // if no empty squares and no winner
  if (emptySquares().length === 0 && !checkWin(origBoard, player)) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "rgb(57, 159, 227)";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}
