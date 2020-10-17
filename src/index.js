const {
  sqIdToRowCol,
  rowColToSqId,
  isSquareOccupied,
  isInRange,
} = require('./utils')
const {
  Piece, 
  Rook,
  Bishop,
  Knight,
  Queen,
  King,
  Pawn
} = require('./Piece')


function stringToClass(s) {
  switch (s) {
    case "rook":
      return Rook;
      break;
    case "knight":
      return Knight;
      break;
    case "bishop":
      return Bishop;
      break;
    case "queen":
      return Queen;
      break;
    case "king":
      return King;
      break;
    case "pawn":
      return Pawn;
      break;
    default:
      throw new Error("Invalid piece class name.");
  }
}



// this should be json, not js
let initialBoardState = {
  "0-0": "white-rook",
  "0-1": "white-knight",
  "0-2": "white-bishop",
  "0-3": "white-queen",
  "0-4": "white-king",
  "0-5": "white-bishop",
  "0-6": "white-knight",
  "0-7": "white-rook",
  "1-0": "white-pawn",
  "1-1": "white-pawn",
  "1-2": "white-pawn",
  "1-3": "white-pawn",
  "1-4": "white-pawn",
  "1-5": "white-pawn",
  "1-6": "white-pawn",
  "1-7": "white-pawn",

  "7-0": "black-rook",
  "7-1": "black-knight",
  "7-2": "black-bishop",
  "7-3": "black-queen",
  "7-4": "black-king",
  "7-5": "black-bishop",
  "7-6": "black-knight",
  "7-7": "black-rook",
  "6-0": "black-pawn",
  "6-1": "black-pawn",
  "6-2": "black-pawn",
  "6-3": "black-pawn",
  "6-4": "black-pawn",
  "6-5": "black-pawn",
  "6-6": "black-pawn",
  "6-7": "black-pawn",
};

let testingBoardState1 = {
  "0-0": "white-rook",
  "2-0": "white-knight",
  "0-2": "white-bishop",
  "0-3": "white-queen",
  "3-3": "white-king",
  "0-5": "white-bishop",
  "0-6": "white-knight",
  "2-7": "white-rook",
  "1-0": "white-pawn",
  "1-1": "white-pawn",
  "2-2": "white-pawn",
  "1-3": "white-pawn",
  "1-4": "white-pawn",
  "2-5": "white-pawn",
  "1-6": "white-pawn",
  "3-7": "white-pawn",

  "4-4": "black-rook",
  "7-1": "black-knight",
  "7-2": "black-bishop",
  "7-3": "black-queen",
  "7-4": "black-king",
  "7-5": "black-bishop",
  "3-6": "black-knight",
  "7-7": "black-rook",
  "6-0": "black-pawn",
  "4-1": "black-pawn",
  "3-2": "black-pawn",
  "2-3": "black-pawn",
  "6-4": "black-pawn",
  "6-5": "black-pawn",
  "6-6": "black-pawn",
  "6-7": "black-pawn",
};
let testingBoardState2 = {
  "0-0": "white-rook",
  "3-3": "white-knight",
  "0-2": "white-bishop",
  "0-3": "white-queen",
  "0-4": "white-king",
  "0-5": "white-bishop",
  "0-6": "white-knight",
  "0-7": "white-rook",
  "1-0": "white-pawn",
  "1-1": "white-pawn",
  "1-2": "white-pawn",
  "1-3": "white-pawn",
  "1-4": "white-pawn",
  "1-5": "white-pawn",
  "1-6": "white-pawn",
  "1-7": "white-pawn",

  "7-0": "black-rook",
  "7-1": "black-knight",
  "7-2": "black-bishop",
  "7-3": "black-queen",
  "7-4": "black-king",
  "7-5": "black-bishop",
  "7-6": "black-knight",
  "7-7": "black-rook",
  "5-0": "black-pawn",
  "5-1": "black-pawn",
  "5-2": "black-pawn",
  "5-3": "black-pawn",
  "5-4": "black-pawn",
  "5-5": "black-pawn",
  "5-6": "black-pawn",
  "5-7": "black-pawn",
};

// overwriting default state for testing
// initialBoardState = testingBoardState1
class Board {
  constructor(initialBoardState) {
    this.whoseTurn = "white";
    this.selectedPiece = null;
    this.validMoves = [];

    this.virtualBoard = {};
    this.initializeVirtualBoard(initialBoardState);

    this.DomBoard = document.getElementById("chess-div");
    this.initializeSquaresAndPieces();

    this.turnIndicator = document.getElementById("whites-turn__text");
  }

  initializeVirtualBoard(initialBoardState) {
    Object.entries(initialBoardState).forEach(([key, value]) => {
      let [color, pieceName] = value.split("-");
      const pieceConstructor = stringToClass(pieceName);
      this.virtualBoard[key] = new pieceConstructor(color, false);
    });
  }

  initializeSquaresAndPieces() {
    for (let col = 7; col >= 0; col--)
      for (let row = 0; row < 8; row++) {
        let classes = [];
        classes.push("square");
        if ((col + row) % 2) classes.push("square__white");
        else classes.push("square__black");
        let potentialPiece = this.virtualBoard[
          `${col.toString()}-${row.toString()}`
        ];

        let colorPiece = ""; // jjust a workaround, It's probably not the cleanset solution
        if (potentialPiece !== undefined) {
          colorPiece = `${potentialPiece.color}-${potentialPiece.name}`;
        }
        this.DomBoard.appendChild(
          this.createSquare(col, row, classes, colorPiece)
        );
      }
  }

  createSquare(col, row, classes, colorPiece) {
    let id = `${col}-${row}`;
    const square = document.createElement("button");
    square.addEventListener("click", () => {
      this.clickedSquare(id);
    });
    // square.id = classes;
    classes.forEach((cl) => {
      square.classList.add(cl);
    });
    if (colorPiece) {
      square.style.backgroundImage = `url(img/${colorPiece}.svg)`;
    }

    square.id = `${col}-${row}`;

    return square;
  }

  clickedSquare(sqId) {
    let piece = this.virtualBoard[sqId];
    // we didn't select any piece prior, and we want to do this now
    if (!this.selectedPiece) {
      if (piece !== undefined)
        if (piece.color === this.whoseTurn) {
          this.showMoves(sqId);
          this.selectedPiece = sqId;
        }
    } else {
      // we're checking if we want to change a piece we control
      if (piece !== undefined && piece.color === this.whoseTurn) {
        this.showMoves(sqId);
        this.selectedPiece = sqId;
      } else {
        // we want to move
        if (this.validMoves.includes(sqId)) {
          this.movePiece(sqId);
          this.nextTurn();
        }
      }
    }
  }

  movePiece(sqId) {
    this.movePieceDom(sqId);
    this.movePieceVirtual(sqId);
  }

  movePieceVirtual(sqId) {
    let buff = this.virtualBoard[this.selectedPiece];
    delete this.virtualBoard[this.selectedPiece];
    this.virtualBoard[sqId] = buff;
  }

  movePieceDom(sqId) {
    let initialSq = document.getElementById(this.selectedPiece);
    let img = initialSq.style.backgroundImage;
    initialSq.style = "";
    let outSq = document.getElementById(sqId);
    outSq.style.backgroundImage = img;
  }

  showMoves(sqId) {
    let piece = this.virtualBoard[sqId];
    if (piece) {
      // removing class from the old moves
      this.validMoves.forEach((m) => {
        let moveSq = document.getElementById(m);
        moveSq.classList.remove("square--valid-move");
      });
      let moves = piece.getValidMoves(sqId, this.virtualBoard);
      // console.log(moves);
      moves.forEach((m) => {
        let moveSq = document.getElementById(m);
        moveSq.classList.add("square--valid-move");
      });
      this.validMoves = moves;
    } else {
      // console.log("This square is empty");
      this.validMoves.forEach((m) => {
        let moveSq = document.getElementById(m);
        moveSq.classList.remove("square--valid-move");
      });
      this.validMoves = [];
    }
  }

  switchTurnColor() {
    if (this.whoseTurn === "black") {
      this.whoseTurn = "white";
    } else {
      this.whoseTurn = "black";
    }
  }

  nextTurn() {
    this.switchTurnColor();
    let text = `${this.whoseTurn}'s turn`;
    this.turnIndicator.innerHTML = text;
    this.showMoves(0);
  }
}

// const g = new Game();
const b = new Board(initialBoardState);
