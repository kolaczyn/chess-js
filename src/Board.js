const { Piece } = require("./pieces/Piece");
const Bishop = require("./pieces/Bishop");
const King = require("./pieces/King");
const Rook = require("./pieces/Rook");
const Queen = require("./pieces/Queen");
const Pawn = require("./pieces/Pawn");
const Knight = require('./pieces/Knight')

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

    this.whitesTurnIndicator = document.getElementById("whites-turn");
    this.blacksTurnIndicator = document.getElementById("blacks-turn");

    this.notificationSink = document.getElementById("notification-sink__body")
  }

  static stringToClass(s) {
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

  initializeVirtualBoard(initialBoardState) {
    Object.entries(initialBoardState).forEach(([key, value]) => {
      let [color, pieceName] = value.split("-");
      const pieceConstructor = Board.stringToClass(pieceName);
      this.virtualBoard[key] = new pieceConstructor(color, false, key);
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
          this.nextTurn(sqId);
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
    this.virtualBoard[this.selectedPiece].id =  sqId// change sqId on the object
    this.virtualBoard[this.selectedPiece].hasMoved = true;
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
      moves.forEach((m) => {
        let moveSq = document.getElementById(m);
        moveSq.classList.add("square--valid-move");
      });
      this.validMoves = moves;
    } else {
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

  nextTurn(sqId) {
    this.addTurnToHistory(sqId)
    this.switchTurnColor();
    let text = `${this.whoseTurn}'s turn`;
    this.whitesTurnIndicator.classList.toggle('hidden')
    this.blacksTurnIndicator.classList.toggle('hidden')
    this.showMoves(0);
  }

  addTurnToHistory(sqId){
    let a = document.createElement("a")
    a.innerHTML = `${this.idToHumRead(this.selectedPiece)} ${this.idToHumRead(sqId)}`
    a.href = "#"
    this.notificationSink.appendChild(a)
  }

  idToHumRead(id){
    let [row, col] = id.split('-')
    row = parseInt(row)+1
    col = String.fromCharCode("A".charCodeAt(0) + parseInt(col))
    return `${row}-${col}`
  }
}

module.exports = Board;
