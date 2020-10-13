"use strict";

// TODO:
// make it possible to select color schemes
// https://davidwalsh.name/css-variables-javascript/ you can access css variables in JS:

// now I realise that it would take a lot more sense to turn ths thing into a class and use getters, methods etc

function sendNotification(message, severity){
  let messageWrapper = document.createElement('p')
  let hr = document.createElement('hr')
  let messageElement = document.createTextNode(`${notificationsCount++}. ${message}`)
  messageWrapper.appendChild(messageElement)
  messageWrapper.appendChild(hr)
  messageWrapper.classList.add(severity)
  // notificationsBody.appendChild(messageWrapper)
  notificationsBody.insertBefore(messageWrapper, notificationsBody.firstChild)
}

function clearNotifications(){
  notificationsBody.innerHTML=''
}

function calculateValidMoves() {
  let pieceName = getPieceName();
  let piecePos = getPiecePos();
  // if (pieceName === "white-pawn") {
  //   sendNotification('selected white-pawn', 'success')
  // } else {
  //   sendNotification('Dont know about pieces other than pawns', 'warning')
  // }
}

function initializePieces() {
  let whitePawns = document.getElementsByClassName("2");
  [...whitePawns].forEach((pawn) => {
    pawn.classList.add("white-pawn");
  });
  let blackPawns = document.getElementsByClassName("7");
  [...blackPawns].forEach((pawn) => {
    pawn.classList.add("black-pawn");
  });
  addPiece("A1", "white-rook");
  addPiece("B1", "white-knight");
  addPiece("C1", "white-bishop");
  addPiece("D1", "white-queen");
  addPiece("E1", "white-king");
  addPiece("F1", "white-bishop");
  addPiece("G1", "white-knight");
  addPiece("H1", "white-rook");

  addPiece("A8", "black-rook");
  addPiece("B8", "black-knight");
  addPiece("C8", "black-bishop");
  addPiece("D8", "black-queen");
  addPiece("E8", "black-king");
  addPiece("F8", "black-bishop");
  addPiece("G8", "black-knight");
  addPiece("H8", "black-rook");
}

function getPiecePos() {
  let [pieceRow, pieceCol, ..._] = [...selectedPiece.classList];
  return `${pieceRow} ${pieceCol}`;
}

function getSquarePos() {
  let [pieceRow, pieceCol, ..._] = [...selectedSquare.classList];
  return `${pieceRow} ${pieceCol}`;
}

function getPieceName() {
  return selectedPiece.classList.item(4);
}

// function checkIfMoveIsValid() {
//   let pieceName = getPieceName();
//   return true;
// }

function initializeNextTurn() {
  isWhitesTurn = !isWhitesTurn;
  selectedSquare = null;
  selectedPiece = null;
  sendNotification(`It's now ${isWhitesTurn ? "white" : "black"}s' turn`, 'info')
}

// moves selected piece to the selected square
function moviePiece() {
  let pieceName = getPieceName();
  selectedPiece.classList.remove(pieceName);
  selectedSquare.classList.add(pieceName);
}

function addPiece(pos, piece) {
  document
    .getElementsByClassName(`${pos[0]} ${pos[1]}`)[0]
    .classList.add(piece);
}

function createSq(order, row, col) {
  const square = document.createElement("button");
  square.classList.add(row, col, "square");
  if (order % 2) square.classList.add("black");
  else square.classList.add("white");

  square.classList.add("square");

  return square;
}

function initializeBoard() {
  let rowArr = ["8", "7", "6", "5", "4", "3", "2", "1"];
  let colArr = ["A", "B", "C", "D", "E", "F", "G", "H"];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      chessDiv.appendChild(createSq(i + j, rowArr[i], colArr[j]));
    }
  }
}

function checkIfIsEmpty(square) {
  let classes = square.className.split(" ");
  let lastElement = classes.slice(-1)[0];
  return lastElement === "white" || lastElement === "black";
}

function checkIfSelectedEnemyPiece(square) {
  let piece = [...square.classList].slice(-1)[0];
  let out = (piece[0] === "b") === isWhitesTurn;
  return out;
}
// will probably have to run this after each turn

function checkForMate() {}


// listener shouldn't do all the logic, it should call the logic only if nessesary.
// the way it works now, each time everything is calculated to every square
// it would be better to do it only after you click the button

function addListenersToSquares() {
  [...chessDiv.children].forEach((square) => {
    square.addEventListener("click", () => {
      let classNames = square.className.split(" ");
      let [row, col, ..._] = classNames;
      let empty = checkIfIsEmpty(square);

      // if you select an empty square, and no piece prior
      if (!selectedPiece && empty) {
        sendNotification("Selected empty square. Select your piece first.", 'danger')
      }

      // if you have selected a piece, but then selected another
      // it means that you either want to attack enemy piece, or
      // want to change a piece you want to move
      // also check if move is valid
      else if (selectedPiece && !empty) {
        if (checkIfSelectedEnemyPiece(square)) {
          sendNotification(`You want to attack ${row}${col}`, 'info')
          initializeNextTurn();
        } else {
          console.log(`You switched a piece you control to ${row}${col}`);
          sendNotification(`You switched a piece you control to ${row}${col}`, 'info')
          selectedPiece = square;
          calculateValidMoves();
        }
      }

      // if you selected a piece and then empty square
      // we have to check if the move is valid
      else if (selectedPiece && empty) {
        console.log(`You moved to ${row}${col}`);
        selectedSquare = square;
        calculateValidMoves();
        moviePiece(selectedPiece, selectedSquare);
        initializeNextTurn();
      }

      // it is the first piece you selected
      // check if you selected a piece of your color
      else if (!selectedSquare && !empty) {
        // console.log(`You have selected ${row}${col}`);
        if (checkIfSelectedEnemyPiece(square)) {
          sendNotification("Selected enemy piece. First select your piece", "danger");
        } else {
          selectedPiece = square;
          sendNotification(`Selected ${row}${col}`, 'info');
        }
      }
    });
  });
}

let notificationsCount = 1;
let isWhitesTurn = true;
let selectedSquare = null;
let selectedPiece = null;
const chessDiv = document.getElementById("chess-div");
const notificationsBody = document.getElementById('notifications-body')
const clearNotificationsBtn = document.getElementById('clear-notifications-btn')
clearNotificationsBtn.addEventListener('click', clearNotifications)
initializeBoard();
initializePieces();
addListenersToSquares();