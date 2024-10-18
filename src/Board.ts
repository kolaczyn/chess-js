import Bishop from './pieces/Bishop';
import King from './pieces/King';
import Knight from './pieces/Knight';
import Pawn from './pieces/Pawn';
import Queen from './pieces/Queen';
import Rook from './pieces/Rook';
import { BoardState, Color, Figure, SquareId, VirtualBoard } from './types';
import { saveGame } from './utils/gameSave.ts';

// overwriting default state for testing
// initialBoardState = testingBoardState1

class Board {
  whoseTurn: 'white' | 'black';
  selectedPiece: SquareId | null;
  validMoves: SquareId[];
  virtualBoard: VirtualBoard;
  DomBoard: HTMLElement;
  whitesTurnIndicator: HTMLElement;
  blacksTurnIndicator: HTMLElement;
  notificationSink: HTMLElement;
  mateIndicator: HTMLElement;

  constructor(initialBoardState: BoardState, whoseTurn: Color = 'white') {
    this.whoseTurn = whoseTurn;
    this.selectedPiece = null;
    this.validMoves = [];

    this.virtualBoard = {};
    this.initializeVirtualBoard(initialBoardState);

    this.DomBoard = document.getElementById('chess-div')!;
    this.initializeSquaresAndPieces();

    this.whitesTurnIndicator = document.getElementById('whites-turn')!;
    this.blacksTurnIndicator = document.getElementById('blacks-turn')!;

    this.notificationSink = document.getElementById('notification-sink__body')!;
    this.mateIndicator = document.getElementById('notification-sink__mate')!;
  }

  static stringToClass(s: Figure) {
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

  initializeVirtualBoard(initialBoardState: BoardState) {
    Object.entries(initialBoardState).forEach(([key, value]) => {
      const [color, pieceName] = value.split('-');
      const pieceConstructor = Board.stringToClass(pieceName as Figure);
      this.virtualBoard[key as SquareId] = new pieceConstructor(
        color as Color,
        false,
        key as SquareId,
      );
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
          this.virtualBoard[`${col.toString()}-${row.toString()}` as SquareId];

        let colorPiece = ''; // jjust a workaround, It's probably not the cleanset solution
        if (potentialPiece !== undefined) {
          colorPiece = `${potentialPiece.color}-${potentialPiece.name}`;
        }
        this.DomBoard.appendChild(
          //   @ts-expect-error
          this.createSquare(col, row, classes, colorPiece),
        );
      }
    }
  }

  createSquare(col: number, row: number, classes: string[], colorPiece: Color) {
    const id = `${col}-${row}`;
    const square = document.createElement('button');
    square.addEventListener('click', () => {
      this.clickedSquare(id as SquareId);
    });
    classes.forEach((cl) => {
      square.classList.add(cl);
    });
    if (colorPiece) {
      square.style.backgroundImage = `url(img/${colorPiece}.svg)`;
    }

    square.id = `${col}-${row}`;
    square.setAttribute('data-testid', `square-${col}-${row}`);

    return square;
  }

  clickedSquare(sqId: SquareId) {
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

          saveGame(this.virtualBoard, this.whoseTurn);
        }
      }
    }
  }

  checkForMate() {
    // find the king, figure out where the enemy can move and see if the king is in danger
    this.mateIndicator.innerHTML = '';
    let kingPos: SquareId;
    const dangerousSquares: SquareId[] = [];
    Object.entries(this.virtualBoard).forEach(([id, piece]) => {
      if (piece.color !== this.whoseTurn) {
        dangerousSquares.push(
          ...piece.getValidMoves(id as SquareId, this.virtualBoard),
        );
      } else if (piece.name === 'king') {
        kingPos = id as SquareId;
      }
    });
    // @ts-expect-error
    if (dangerousSquares.includes(kingPos)) {
      this.mateIndicator.innerHTML = 'Mate';
    }
    return true;
  }

  // check if you can make any move to defend the king
  checkForCheckMate() {
    const validMoves: SquareId[] = [];
    Object.entries(this.virtualBoard).forEach(([id, piece]) => {
      if (piece.color === this.whoseTurn) {
        const moves = piece.getValidMoves(
          id as SquareId,
          this.virtualBoard,
          true,
        );
        if (moves) {
          validMoves.push(...moves);
        }
      }
    });
    if (!validMoves.length) {
      this.mateIndicator.innerHTML = 'Check Mate';
      alert('check mate');
    }
  }

  movePiece(sqId: SquareId) {
    this.movePieceDom(sqId);
    this.movePieceVirtual(sqId);
  }

  movePieceVirtual(sqId: SquareId) {
    // @ts-expect-error
    const buff = this.virtualBoard[this.selectedPiece];
    // @ts-expect-error
    this.virtualBoard[this.selectedPiece].id = sqId; // change sqId on the object
    // @ts-expect-error
    this.virtualBoard[this.selectedPiece].hasMoved = true;
    // @ts-expect-error
    delete this.virtualBoard[this.selectedPiece];
    this.virtualBoard[sqId] = buff;
  }

  movePieceDom(sqId: SquareId) {
    const initialSq = document.getElementById(this.selectedPiece!)!;
    const img = initialSq.style.backgroundImage;
    // @ts-expect-error
    initialSq.style = '';
    const outSq = document.getElementById(sqId);
    // @ts-expect-error
    outSq.style.backgroundImage = img;
  }

  showMoves(sqId: SquareId) {
    const piece = this.virtualBoard[sqId];
    if (piece) {
      // removing class from the old moves
      this.validMoves.forEach((m) => {
        const moveSq = document.getElementById(m)!;
        moveSq.classList.remove('square--valid-move');
      });
      const moves = piece.getValidMoves(sqId, this.virtualBoard, true);
      moves.forEach((m) => {
        const moveSq = document.getElementById(m)!;
        moveSq.classList.add('square--valid-move');
      });
      this.validMoves = moves;
    } else {
      this.validMoves.forEach((m) => {
        const moveSq = document.getElementById(m)!;
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

  nextTurn(sqId: SquareId) {
    this.addTurnToHistory(sqId);
    this.switchTurnColor();
    // const text = `${this.whoseTurn}'s turn`;
    this.whitesTurnIndicator.classList.toggle('hidden');
    this.blacksTurnIndicator.classList.toggle('hidden');
    // @ts-expect-error
    this.showMoves(0);
    if (this.checkForMate()) this.checkForCheckMate();
  }

  addTurnToHistory(sqId: SquareId) {
    const a = document.createElement('a');
    // @ts-expect-error
    a.innerHTML = `${this.idToHumRead(this.selectedPiece)} ${this.idToHumRead(
      sqId,
    )}`;
    a.href = '#';
    this.notificationSink.appendChild(a);
  }

  idToHumRead(id: SquareId) {
    let [row, col] = id.split('-');
    // @ts-expect-error
    row = parseInt(row) + 1;
    col = String.fromCharCode('A'.charCodeAt(0) + parseInt(col));
    return `${row}-${col}`;
  }
}

export default Board;
