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

class Piece {
  name!: Figure;
  // @ts-expect-error the method is implemented in the subclasses
  getValidMoves(
    sqId: SquareId,
    virtualBoard: VirtualBoard,
    boardInfo: BoardInfo,
    checkForCheckmate?: boolean,
  ): SquareId[];

  color: Color;
  hasMoved: boolean;
  id: SquareId;
  constructor(color: Color, hasMoved: boolean, id: SquareId) {
    this.color = color;
    this.hasMoved = hasMoved;
    this.id = id;
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

  protected static isSquareOccupied(
    row: PosId,
    col: PosId,
    virtualBoard: VirtualBoard,
  ) {
    const piece = virtualBoard[`${row}-${col}`];
    if (piece) {
      return piece.color;
    }
    return '';
  }

  private static rowColToSqId(row: PosId, col: PosId): SquareId {
    return `${row}-${col}`;
  }

  // definitely will have to refactor this
  // helper function
  // it stops when it encounters an obstacle
  private checkMovesBreak(
    virtualBoard: VirtualBoard,
    calculateSquare: CalculateSquare,
  ): SquareId[] {
    const validMoves: SquareId[] = [];
    for (let i = 1; i < 8; i++) {
      const checkedSquare = calculateSquare(this.row, this.col, i) as [
        PosId,
        PosId,
      ];
      if (Piece.isInRange(...checkedSquare)) {
        const potentialPiece = Piece.isSquareOccupied(
          ...checkedSquare,
          virtualBoard,
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
  protected checkMoves(
    virtualBoard: VirtualBoard,
    calculateSquare: CalculateSquare,
  ): SquareId[] {
    const validMoves: SquareId[] = [];
    // @ts-expect-error
    const checkedSquare = calculateSquare(this.row, this.col) as PosArr;
    if (Piece.isInRange(...checkedSquare)) {
      const potentialPiece = Piece.isSquareOccupied(
        ...checkedSquare,
        virtualBoard,
      );
      if (potentialPiece) {
        if (potentialPiece !== this.color) {
          validMoves.push(Piece.rowColToSqId(...checkedSquare));
        }
      } else validMoves.push(Piece.rowColToSqId(...checkedSquare));
    }
    return validMoves;
  }

  protected getValidHorizontalMoves(
    _sqId: SquareId,
    virtualBoard: VirtualBoard,
  ): SquareId[] {
    const top = this.checkMovesBreak(virtualBoard, (r, c, i) => [r + i, c]);
    const right = this.checkMovesBreak(virtualBoard, (r, c, i) => [r, c + i]);
    const bottom = this.checkMovesBreak(virtualBoard, (r, c, i) => [r - i, c]);
    const left = this.checkMovesBreak(virtualBoard, (r, c, i) => [r, c - i]);

    return [...top, ...right, ...bottom, ...left];
  }

  protected getValidDiagonalMoves(
    _sqId: SquareId,
    virtualBoard: VirtualBoard,
  ): SquareId[] {
    const tl = this.checkMovesBreak(virtualBoard, (r, c, i) => [r + i, c - i]);
    const tr = this.checkMovesBreak(virtualBoard, (r, c, i) => [r + i, c + i]);
    const br = this.checkMovesBreak(virtualBoard, (r, c, i) => [r - i, c + i]);
    const bl = this.checkMovesBreak(virtualBoard, (r, c, i) => [r - i, c - i]);

    const initialMoves = [...tl, ...tr, ...br, ...bl];
    return initialMoves;
  }

  // checks of the potential move causes the piece's king to be on a check
  // that's obviously an illegal move
  // analyze board if the piece has moved to sqId
  // find the king, figure out where the enemy can move and see if the king is in danger
  protected checkForCheckmate(
    sqId: SquareId,
    virtualBoard: VirtualBoard,
    boardInfo: BoardInfo,
  ) {
    // save piece that may be where we want to move, so we can populate it later
    const otherPieceBuff = virtualBoard[sqId];
    // we remove the current position of the piece
    delete virtualBoard[this.id];
    // we move the piece to sqId
    virtualBoard[sqId] = this;

    let kingPos: SquareId;
    const dangerousSquares: SquareId[] = [];
    Object.entries(virtualBoard).forEach(([id, piece]) => {
      if (piece.color !== this.color) {
        dangerousSquares.push(
          ...piece.getValidMoves(id as SquareId, virtualBoard, boardInfo),
        );
      } else if (piece.name === 'king') {
        kingPos = id as SquareId;
      }
    });
    // cleaning up
    delete virtualBoard[sqId];
    virtualBoard[this.id] = this;
    if (otherPieceBuff !== undefined) {
      virtualBoard[sqId] = otherPieceBuff;
    }
    // @ts-expect-error
    return !dangerousSquares.includes(kingPos);
  }
}

export default Piece;
