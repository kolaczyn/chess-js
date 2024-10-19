import {
  BoardInfo,
  CalculateSquare,
  Color,
  Figure,
  PosArr,
  PosId,
  SquareId,
  VirtualBoard,
} from '../types';
import { BoardHelpers } from './BoardHelpers.ts';

class Piece {
  name!: Figure;
  virtualBoard: VirtualBoard;
  boardHelpers: BoardHelpers;
  // @ts-expect-error the method is implemented in the subclasses
  getValidMoves(
    sqId: SquareId,
    boardInfo: BoardInfo,
    checkForCheckmate?: boolean,
  ): SquareId[];

  color: Color;
  hasMoved: boolean;
  id: SquareId;
  constructor(
    color: Color,
    hasMoved: boolean,
    id: SquareId,
    virtualBoard: VirtualBoard,
  ) {
    this.color = color;
    this.hasMoved = hasMoved;
    this.id = id;
    this.virtualBoard = virtualBoard;
    this.boardHelpers = new BoardHelpers(virtualBoard);
  }

  protected get row(): PosId {
    return parseInt(this.id.split('-')[0]) as PosId;
  }

  protected get col(): PosId {
    return parseInt(this.id.split('-')[1]) as PosId;
  }

  protected static isInRange(row: number, col: number) {
    return row >= 0 && row <= 7 && col >= 0 && col <= 7;
  }

  private static rowColToSqId(row: PosId, col: PosId): SquareId {
    return `${row}-${col}`;
  }

  // definitely will have to refactor this
  // helper function
  // it stops when it encounters an obstacle
  private checkMovesBreak(calculateSquare: CalculateSquare): SquareId[] {
    const validMoves: SquareId[] = [];
    for (let i = 1; i < 8; i++) {
      const checkedSquare = calculateSquare(this.row, this.col, i) as [
        PosId,
        PosId,
      ];
      if (Piece.isInRange(...checkedSquare)) {
        const potentialPiece = this.boardHelpers.isSquareOccupied(
          ...checkedSquare,
        );
        if (potentialPiece) {
          if (potentialPiece !== this.color) {
            validMoves.push(Piece.rowColToSqId(...checkedSquare));
          }
          break;
        } else validMoves.push(Piece.rowColToSqId(...checkedSquare));
      }
    }
    return validMoves;
  }

  // I should probably rewrite this, so it accepts array of squares to check
  // and then checks them, returns array of valid squares
  protected checkMoves(calculateSquare: CalculateSquare): SquareId[] {
    const validMoves: SquareId[] = [];
    // @ts-expect-error
    const checkedSquare = calculateSquare(this.row, this.col) as PosArr;
    if (Piece.isInRange(...checkedSquare)) {
      const potentialPiece = this.boardHelpers.isSquareOccupied(
        ...checkedSquare,
      );
      if (potentialPiece) {
        if (potentialPiece !== this.color) {
          validMoves.push(Piece.rowColToSqId(...checkedSquare));
        }
      } else validMoves.push(Piece.rowColToSqId(...checkedSquare));
    }
    return validMoves;
  }

  protected getValidHorizontalMoves(_sqId: SquareId): SquareId[] {
    const top = this.checkMovesBreak((r, c, i) => [r + i, c]);
    const right = this.checkMovesBreak((r, c, i) => [r, c + i]);
    const bottom = this.checkMovesBreak((r, c, i) => [r - i, c]);
    const left = this.checkMovesBreak((r, c, i) => [r, c - i]);

    return [...top, ...right, ...bottom, ...left];
  }

  protected getValidDiagonalMoves(_sqId: SquareId): SquareId[] {
    const tl = this.checkMovesBreak((r, c, i) => [r + i, c - i]);
    const tr = this.checkMovesBreak((r, c, i) => [r + i, c + i]);
    const br = this.checkMovesBreak((r, c, i) => [r - i, c + i]);
    const bl = this.checkMovesBreak((r, c, i) => [r - i, c - i]);

    const initialMoves = [...tl, ...tr, ...br, ...bl];
    return initialMoves;
  }

  // checks of the potential move causes the piece's king to be on a check
  // that's obviously an illegal move
  // analyze board if the piece has moved to sqId
  // find the king, figure out where the enemy can move and see if the king is in danger
  protected checkForCheckmate(sqId: SquareId, boardInfo: BoardInfo) {
    // save piece that may be where we want to move, so we can populate it later
    const otherPieceBuff = this.virtualBoard[sqId];
    // we remove the current position of the piece
    delete this.virtualBoard[this.id];
    // we move the piece to sqId
    this.virtualBoard[sqId] = this;

    let kingPos: SquareId;
    const dangerousSquares: SquareId[] = [];
    Object.entries(this.virtualBoard).forEach(([id, piece]) => {
      if (piece.color !== this.color) {
        dangerousSquares.push(
          ...piece.getValidMoves(id as SquareId, boardInfo),
        );
      } else if (piece.name === 'king') {
        kingPos = id as SquareId;
      }
    });
    // cleaning up
    delete this.virtualBoard[sqId];
    this.virtualBoard[this.id] = this;
    if (otherPieceBuff !== undefined) {
      this.virtualBoard[sqId] = otherPieceBuff;
    }
    // @ts-expect-error
    return !dangerousSquares.includes(kingPos);
  }
}

export default Piece;
