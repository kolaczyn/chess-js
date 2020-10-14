// manages notifications
class Notifications {
  constructor() {
    this.notificationsCount = 1;
    this.notificationsBody = document.getElementById("notifications-body");
    this.clearNotificationsBtn = document.getElementById(
      "clear-notifications-btn"
    );
    this.clearNotificationsBtn.addEventListener("click", () =>
      this.clearNotifications()
    );
  }
  clearNotifications() {
    // this.notificationsBody.innerHTML = "";
    // console.log(this)
    this.notificationsBody.innerHTML = "";
  }
  sendNotification(message, severity) {
    let messageWrapper = document.createElement("p");
    let hr = document.createElement("hr");
    let messageElement = document.createTextNode(
      `${this.notificationsCount++}. ${message}`
    );
    messageWrapper.appendChild(messageElement);
    messageWrapper.appendChild(hr);
    messageWrapper.classList.add(severity);
    // notificationsBody.appendChild(messageWrapper)
    this.notificationsBody.insertBefore(
      messageWrapper,
      this.notificationsBody.firstChild
    );
  }
}

// manages turn indicator
class TurnIndicator {
  constructor() {
    this.whitesTurnIndicator = document.getElementById("whites-turn");
    this.blacksTurnIndicator = document.getElementById("blacks-turn");
  }

  changeTurnIndicators() {
    this.whitesTurnIndicator.classList.toggle("hidden");
    this.blacksTurnIndicator.classList.toggle("hidden");
  }
}

// manages board
class Game {
  constructor() {
    this.chessDiv = document.getElementById("chess-div");
    this.initializeBoard();
    this.initializePieces();
    this.addListenersToSquares();

    this.notifications = new Notifications();
    this.turnIndicator = new TurnIndicator();

    this.isWhitesTurn = true;
    this.selectedSquare = null;
    this.selectedPiece = null;
  }

  initializePieces() {
    let whitePawns = document.getElementsByClassName("2");
    [...whitePawns].forEach((pawn) => {
      pawn.classList.add("white-pawn");
    });
    let blackPawns = document.getElementsByClassName("7");
    [...blackPawns].forEach((pawn) => {
      pawn.classList.add("black-pawn");
    });
    this.addPiece("A1", "white-rook");
    this.addPiece("B1", "white-knight");
    this.addPiece("C1", "white-bishop");
    this.addPiece("D1", "white-queen");
    this.addPiece("E1", "white-king");
    this.addPiece("F1", "white-bishop");
    this.addPiece("G1", "white-knight");
    this.addPiece("H1", "white-rook");

    this.addPiece("A8", "black-rook");
    this.addPiece("B8", "black-knight");
    this.addPiece("C8", "black-bishop");
    this.addPiece("D8", "black-queen");
    this.addPiece("E8", "black-king");
    this.addPiece("F8", "black-bishop");
    this.addPiece("G8", "black-knight");
    this.addPiece("H8", "black-rook");
  }

  rotateBoard() {
    this.chessDiv.classList.toggle("rotate");
  }

  initializeNextTurn() {
    this.isWhitesTurn = !this.isWhitesTurn;
    this.turnIndicator.changeTurnIndicators();
    this.selectedSquare = null;
    this.selectedPiece = null;
    this.notifications.sendNotification(
      `It's now ${this.isWhitesTurn ? "white" : "black"}s' turn`,
      "info"
    );
    this.rotateBoard();
  }

  addPiece(pos, piece) {
    document
      .getElementsByClassName(`${pos[0]} ${pos[1]}`)[0]
      .classList.add(piece);
  }

  createSq(order, row, col) {
    const square = document.createElement("button");
    square.classList.add(row, col, "square");
    if (order % 2) square.classList.add("black");
    else square.classList.add("white");

    square.classList.add("square");

    return square;
  }

  initializeBoard() {
    let rowArr = ["8", "7", "6", "5", "4", "3", "2", "1"];
    let colArr = ["A", "B", "C", "D", "E", "F", "G", "H"];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        this.chessDiv.appendChild(this.createSq(i + j, rowArr[i], colArr[j]));
      }
    }
  }

  checkIfIsEmpty(square) {
    let classes = square.className.split(" ");
    let lastElement = classes.slice(-1)[0];
    return lastElement === "white" || lastElement === "black";
  }

  checkIfSelectedEnemyPiece(square) {
    let piece = [...square.classList].slice(-1)[0];
    let out = (piece[0] === "b") === this.isWhitesTurn;
    return out;
  }

  // listener shouldn't do all the logic, it should call the logic only if nessesary.
  // the way it works now, each time everything is calculated to every square
  // it would be better to do it only after you click the button

  addListenersToSquares() {
    [...this.chessDiv.children].forEach((square) => {
      square.addEventListener("click", () => {
        let classNames = square.className.split(" ");
        let [row, col, ..._] = classNames;
        let empty = this.checkIfIsEmpty(square);

        // if you select an empty square, and no piece prior
        if (!this.selectedPiece && empty) {
          this.notifications.sendNotification(
            "Selected empty square. Select your piece first.",
            "danger"
          );
        }

        // if you have selected a piece, but then selected another
        // it means that you either want to attack enemy piece, or
        // want to change a piece you want to move
        // also check if move is valid
        else if (this.selectedPiece && !empty) {
          if (this.checkIfSelectedEnemyPiece(square)) {
            this.notifications.sendNotification(
              `You want to attack ${row}${col}`,
              "info"
            );
            initializeNextTurn();
          } else {
            this.notifications.sendNotification(
              `You switched a piece you control to ${row}${col}`,
              "info"
            );
            this.selectedPiece = square;
          }
        }

        // if you selected a piece and then empty square
        // we have to check if the move is valid
        else if (this.selectedPiece && empty) {
          this.notifications.sendNotification(`You moved to ${row}${col}`);
          this.selectedSquare = square;
          this.moviePiece(this.selectedPiece, this.selectedSquare);
          this.initializeNextTurn();
        }

        // it is the first piece you selected
        // check if you selected a piece of your color
        else if (!this.selectedSquare && !empty) {
          if (this.checkIfSelectedEnemyPiece(square)) {
            this.notifications.sendNotification(
              "Selected enemy piece. First select your piece",
              "danger"
            );
          } else {
            this.selectedPiece = square;
            this.notifications.sendNotification(
              `Selected ${row}${col}`,
              "info"
            );
          }
        }
      });
    });
  }

  moviePiece() {
    let pieceName = this.selectedPieceName;
    this.selectedPiece.classList.remove(pieceName);
    this.selectedSquare.classList.add(pieceName);
  }

  get selectedPiecePos() {
    let [pieceRow, pieceCol, ..._] = [...this.selectedPiece.classList];
    return `${pieceRow} ${pieceCol}`;
  }

  get selectedSquarePos() {
    let [pieceRow, pieceCol, ..._] = [...selectedSquare.classList];
    return `${pieceRow} ${pieceCol}`;
  }

  get selectedPieceName() {
    return this.selectedPiece.classList.item(4);
  }
}

class Piece {
  constructor(color, col, row, boardRef) {
    // this.color = color;
    this.col = col;
    // don't modify it, it's for anylising
    // valid movesb
    this.boardRef = boardRef;
  }
  // learn in depth how classes work in JS
  checkIfValid() {
    throw new Error("You didn' overwrite default checkIfValid method!");
  }
  // putPiece(squareDiv){
  //   this.currentSq;
  // }
}

// I will be probably more optimal (performance wise) to use prototypes instead of classes
// check if that's true
// also check what TS compiler does with classes
class Pawn extends Piece {
  constructor(color, col, boardRef) {
    // we probably can already deduce that from its position, but whatever
    // I'll fix that later
    let row = color == "white" ? 1 : 6;
    super(color, col, row, boardRef);
    this.hasMoved = false;
    this.name = "pawn";
  }
  checkIfValid() {
    return false;
  }
}

class King extends Piece {
  constructor(color, boardRef) {
    // we probably can already deduce that from its position, but whatever
    // I'll fix that later
    let row = color === "white" ? 0 : 7;
    let col = 4;
    super(color, col, boardRef);
    this.hasMoved = false;
    this.name = "king";
  }
  checkIfValid() {
    return false;
  }
}
class Queen extends Piece {
  constructor(color, boardRef) {
    // we probably can already deduce that from its position, but whatever
    // I'll fix that later
    let row = color === "white" ? 0 : 7;
    let col = 3;
    super(color, col, row, boardRef);
    this.name = "queen";
  }
  checkIfValid() {
    return false;
  }
}
class Rook extends Piece {
  constructor(color, col, boardRef) {
    // we probably can already deduce that from its position, but whatever
    // I'll fix that later
    let row = color === "white" ? 0 : 7;
    super(color, col, row, boardRef);
    this.name = "rook";
  }
  checkIfValid() {
    return false;
  }
}

class Bishop extends Piece {
  constructor(color, col, boardRef) {
    // we probably can already deduce that from its position, but whatever
    // I'll fix that later
    let row = color === "white" ? 0 : 7;
    super(color, col, row, boardRef);
    this.name = "bishop";
  }
  checkIfValid() {
    return false;
  }
}

class Knight extends Piece {
  constructor(color, col, boardRef) {
    // we probably can already deduce that from its position, but whatever
    // I'll fix that later
    let row = color === "white" ? 0 : 7;
    super(color, row, col, boardRef);
    this.name = "knight";
  }
  checkIfValid() {
    return false;
  }
}

class Board {
  constructor() {
    this.virtBoard = {};
    this.DomBoard = document.getElementById("chess-div");
    this.initializeSquares();
    this.initializePieces();
  }
  initializePieces() {
    ["black", "white"].forEach((color) => {
      this.virtBoard[color] = {};
      this.virtBoard[color].pawns = [];
      for (let i = 0; i < 8; i++) {
        this.virtBoard[color].pawns.push(new Pawn(color, i, this));
      }
      this.virtBoard[color].rook0 = new Rook(color, 0, this);
      this.virtBoard[color].knight0 = new Knight(color, 1, this);
      this.virtBoard[color].bishop0 = new Bishop(color, 2, this);
      this.virtBoard[color].queen = new Queen(color, this);
      this.virtBoard[color].king = new King(color, this);
      this.virtBoard[color].bishop1 = new Bishop(color, 3, this);
      this.virtBoard[color].knight1 = new Knight(color, 6, this);
      this.virtBoard[color].rook1 = new Rook(color, 7, this);
      // this
    });
  }
  initializeSquares() {
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
      // console.log('run')
      this.DomBoard.appendChild(this.createSquare(i,j));
    }
  }

  createSquare(row, col) {
    const square = document.createElement("button");
    square.classList.add("square");
    if ((row + col) % 2) square.classList.add("square__black");
    else square.classList.add("square__white");

    square.classList.add("square");
    square.id = `r${row}-c${col}`;

    return square;
  }
}

("use s/strict");
// let document = global
// const g = new/ Game();
const b = new Board();
// console.log(b);
