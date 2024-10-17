import Piece from './pieces/Piece';
import Bishop from './pieces/Bishop';
import King from './pieces/King';
import Knight from './pieces/Knight';
import Pawn from './pieces/Pawn';
import Queen from './pieces/Queen';
import Rook from './pieces/Rook';
// overwriting default state for testing
// initialBoardState = testingBoardState1
class Board {
  constructor(initialBoardState) {
    this.whoseTurn = 'white';
    this.selectedPiece = null;
    this.validMoves = [];

    this.virtualBoard = {};
    this.initializeVirtualBoard(initialBoardState);

    this.DomBoard = document.getElementById('chess-div');
    this.initializeSquaresAndPieces();

    this.whitesTurnIndicator = document.getElementById('whites-turn');
    this.blacksTurnIndicator = document.getElementById('blacks-turn');

    this.notificationSink = document.getElementById('notification-sink__body');
    this.mateIndicator = document.getElementById('notification-sink__mate');
  }

  static stringToClass(s) {
    switch (s) {
      case 'rook':
        return Rook;
      case 'knight':
        return Knight;
      case 'bishop':
        return Bishop;
      case 'queen':
        return Queen;
      case 'king':
        return King;
      case 'pawn':
        return Pawn;
      default:
        throw new Error('Invalid piece class name.');
    }
  }

  initializeVirtualBoard(initialBoardState) {
    Object.entries(initialBoardState).forEach(([key, value]) => {
      const [color, pieceName] = value.split('-');
      const pieceConstructor = Board.stringToClass(pieceName);
      this.virtualBoard[key] = new pieceConstructor(color, false, key);
    });
  }

  initializeSquaresAndPieces() {
    for (let col = 7; col >= 0; col--) {
      for (let row = 0; row < 8; row++) {
        const classes = [];
        classes.push('square');
        if ((col + row) % 2) classes.push('square__white');
        else classes.push('square__black');
        const potentialPiece =
          this.virtualBoard[`${col.toString()}-${row.toString()}`];

        let colorPiece = ''; // jjust a workaround, It's probably not the cleanset solution
        if (potentialPiece !== undefined) {
          colorPiece = `${potentialPiece.color}-${potentialPiece.name}`;
        }
        this.DomBoard.appendChild(
          this.createSquare(col, row, classes, colorPiece),
        );
      }
    }
  }

  createSquare(col, row, classes, colorPiece) {
    const id = `${col}-${row}`;
    const square = document.createElement('button');
    square.addEventListener('click', () => {
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
    const piece = this.virtualBoard[sqId];
    // we didn't select any piece prior, and we want to do this now
    if (!this.selectedPiece) {
      if (piece !== undefined) {
        if (piece.color === this.whoseTurn) {
          this.showMoves(sqId);
          this.selectedPiece = sqId;
        }
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

  checkForMate() {
    // find the king, figure out where the enemy can move and see if the king is in danger
    this.mateIndicator.innerHTML = '';
    let kingPos;
    const dangerougSquares = [];
    Object.entries(this.virtualBoard).forEach(([id, piece]) => {
      if (piece.color !== this.whoseTurn) {
        dangerougSquares.push(...piece.getValidMoves(id, this.virtualBoard));
      } else if (piece.name === 'king') {
        kingPos = id;
      }
    });
    if (dangerougSquares.includes(kingPos)) {
      this.mateIndicator.innerHTML = 'Mate';
    }
    return true;
  }

  // check if you can make any move to defend the king
  checkForCheckMate() {
    const validMoves = [];
    Object.entries(this.virtualBoard).forEach(([id, piece]) => {
      if (piece.color === this.whoseTurn) {
        const moves = piece.getValidMoves(id, this.virtualBoard, true);
        if (moves) {
          validMoves.push(...moves);
        }
      }
    });
    console.log(validMoves);
    // let moves = piece.getValidMoves(sqId, this.virtualBoard, true);
    if (!validMoves.length) {
      this.mateIndicator.innerHTML = 'Check Mate';
      console.log('check mate');
    }
  }

  movePiece(sqId) {
    this.movePieceDom(sqId);
    this.movePieceVirtual(sqId);
  }

  movePieceVirtual(sqId) {
    const buff = this.virtualBoard[this.selectedPiece];
    this.virtualBoard[this.selectedPiece].id = sqId; // change sqId on the object
    this.virtualBoard[this.selectedPiece].hasMoved = true;
    delete this.virtualBoard[this.selectedPiece];
    this.virtualBoard[sqId] = buff;
  }

  movePieceDom(sqId) {
    const initialSq = document.getElementById(this.selectedPiece);
    const img = initialSq.style.backgroundImage;
    initialSq.style = '';
    const outSq = document.getElementById(sqId);
    outSq.style.backgroundImage = img;
  }

  showMoves(sqId) {
    const piece = this.virtualBoard[sqId];
    if (piece) {
      // removing class from the old moves
      this.validMoves.forEach((m) => {
        const moveSq = document.getElementById(m);
        moveSq.classList.remove('square--valid-move');
      });
      const moves = piece.getValidMoves(sqId, this.virtualBoard, true);
      moves.forEach((m) => {
        const moveSq = document.getElementById(m);
        moveSq.classList.add('square--valid-move');
      });
      this.validMoves = moves;
    } else {
      this.validMoves.forEach((m) => {
        const moveSq = document.getElementById(m);
        moveSq.classList.remove('square--valid-move');
      });
      this.validMoves = [];
    }
  }

  switchTurnColor() {
    if (this.whoseTurn === 'black') {
      this.whoseTurn = 'white';
    } else {
      this.whoseTurn = 'black';
    }
  }

  nextTurn(sqId) {
    this.addTurnToHistory(sqId);
    this.switchTurnColor();
    const text = `${this.whoseTurn}'s turn`;
    this.whitesTurnIndicator.classList.toggle('hidden');
    this.blacksTurnIndicator.classList.toggle('hidden');
    this.showMoves(0);
    if (this.checkForMate()) this.checkForCheckMate();
  }

  addTurnToHistory(sqId) {
    const a = document.createElement('a');
    a.innerHTML = `${this.idToHumRead(this.selectedPiece)} ${this.idToHumRead(
      sqId,
    )}`;
    a.href = '#';
    this.notificationSink.appendChild(a);
  }

  idToHumRead(id) {
    let [row, col] = id.split('-');
    row = parseInt(row) + 1;
    col = String.fromCharCode('A'.charCodeAt(0) + parseInt(col));
    return `${row}-${col}`;
  }
}

export default Board;
