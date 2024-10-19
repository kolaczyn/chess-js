import {
  BoardInfo,
  BoardState,
  Color,
  Figure,
  SquareId,
  TaggedSquareId,
  VirtualBoard,
} from './types';
import { saveGame } from './utils/gameSave.ts';
import { idToHumRead } from './utils/idToHumRead.ts';
import { stringToClass } from './utils/figureToClass.ts';
import { sqIdToFileRank } from './utils/sqIdToFileRank.ts';

// overwriting default state for testing
// initialBoardState = testingBoardState1

class Board {
  boardInfo: BoardInfo;
  selectedPiece: SquareId | null;
  validMoves: TaggedSquareId[];
  virtualBoard: VirtualBoard;
  DomBoard: HTMLElement;
  whitesTurnIndicator: HTMLElement;
  blacksTurnIndicator: HTMLElement;
  notificationSink: HTMLElement;
  mateIndicator: HTMLElement;

  constructor(initialBoardState: BoardState, boardInfo: BoardInfo) {
    this.boardInfo = boardInfo;
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

  initializeVirtualBoard(initialBoardState: BoardState) {
    Object.entries(initialBoardState).forEach(([key, value]) => {
      const [color, pieceName] = value.split('-');
      const pieceConstructor = stringToClass(pieceName as Figure);
      this.virtualBoard[key as SquareId] = new pieceConstructor(
        color as Color,
        key as SquareId,
        this.virtualBoard,
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
        if (piece.color === this.boardInfo.whoseTurn) {
          this.showMoves(sqId);
          this.selectedPiece = sqId;
        }
      }
    } else {
      // we're checking if we want to change a piece we control
      if (piece !== undefined && piece.color === this.boardInfo.whoseTurn) {
        this.showMoves(sqId);
        this.selectedPiece = sqId;
      } else {
        // we want to move
        if (this.validMoves.some((x) => x.id === sqId)) {
          this.saveKingRookMoved(this.selectedPiece!);
          this.movePiece(sqId);
          this.nextTurn(sqId);

          saveGame(this.virtualBoard, this.boardInfo);
        }
      }
    }
  }

  saveKingRookMoved(sqId: SquareId) {
    const piece = this.virtualBoard[sqId];
    if (!piece) return;

    const kingMoved = piece.name === 'king';
    if (kingMoved) {
      this.boardInfo.didKingMove[piece.color] = true;
      return;
    }
    const rookMoved = piece.name === 'rook';
    if (rookMoved) {
      const { file, rank } = sqIdToFileRank(sqId);
      if (file === 'a' && rank === '8' && piece.color === 'black')
        this.boardInfo.didRookMove['a-black'] = true;
      if (file === 'h' && rank === '8' && piece.color === 'black')
        this.boardInfo.didRookMove['h-black'] = true;
      if (file === 'a' && rank === '1' && piece.color === 'white')
        this.boardInfo.didRookMove['a-white'] = true;
      if (file === 'h' && rank === '1' && piece.color === 'white')
        this.boardInfo.didRookMove['h-white'] = true;
    }
  }

  checkForMate() {
    // find the king, figure out where the enemy can move and see if the king is in danger
    this.mateIndicator.innerHTML = '';
    let kingPos: SquareId;
    const dangerousSquares: TaggedSquareId[] = [];
    Object.entries(this.virtualBoard).forEach(([id, piece]) => {
      if (piece.color !== this.boardInfo.whoseTurn) {
        dangerousSquares.push(
          ...piece.getValidMoves(id as SquareId, this.boardInfo),
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
    const validMoves: TaggedSquareId[] = [];
    Object.entries(this.virtualBoard).forEach(([id, piece]) => {
      if (piece.color === this.boardInfo.whoseTurn) {
        const moves = piece.getValidMoves(id as SquareId, this.boardInfo, true);
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
        const moveSq = document.getElementById(m.id)!;
        moveSq.classList.remove('square--valid-move');
      });
      const moves = piece.getValidMoves(sqId, this.boardInfo, true);
      moves.forEach((m) => {
        const moveSq = document.getElementById(m.id)!;
        moveSq.classList.add('square--valid-move');
      });
      this.validMoves = moves;
    } else {
      this.validMoves.forEach((m) => {
        const moveSq = document.getElementById(m.id)!;
        moveSq.classList.remove('square--valid-move');
      });
      this.validMoves = [];
    }
  }

  switchTurnColor() {
    if (this.boardInfo.whoseTurn === 'black') {
      this.boardInfo.whoseTurn = 'white';
    } else {
      this.boardInfo.whoseTurn = 'black';
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
    a.innerHTML = `${idToHumRead(this.selectedPiece)} ${idToHumRead(sqId)}`;
    a.href = '#';
    this.notificationSink.appendChild(a);
  }
}

export default Board;
