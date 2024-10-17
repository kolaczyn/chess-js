import {
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
    checkForCheckmate?: boolean,
  ): SquareId[];

  color: Color;
  hasMoved: boolean;
  id: SquareId;
  constructor(color: Color, hasMoved: boolean, id: SquareId) {
    this.color = color;
    this.hasMoved = hasMoved;
    this.id = id;
    // we don't care if bishop or knight has moved
    // I might do something like this in the future:
    // if (hasMoved !== undefined){
    //   this.hasMoved=this.hasMoved
    // }
  }

  get row(): PosId {
    return parseInt(this.id.split('-')[0]) as PosId;
  }

  get col(): PosId {
    return parseInt(this.id.split('-')[1]) as PosId;
  }

  static sqIdToRowCol(sqId: SquareId) {
    const [row, col] = sqId.split('-');
    return [parseInt(row), parseInt(col)];
  }

  static isInRange(row: number, col: number) {
    return row >= 0 && row <= 7 && col >= 0 && col <= 7;
  }

  static isSquareOccupied(row: PosId, col: PosId, virtualBoard: VirtualBoard) {
    const piece = virtualBoard[`${row}-${col}`];
    if (piece) {
      return piece.color;
    }
    return '';
  }

  static rowColToSqId(row: PosId, col: PosId): SquareId {
    return `${row}-${col}`;
  }

  // definitely will have to refactor this
  // helper function
  // it stops when it encourters an obstacle
  checkMovesBreak(
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

  // I should probably rewrite this so it accepts array of squares to check
  // and then checks them, returns array of valid squares
  checkMoves(
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

  getValidHorizontalMoves(
    _sqId: SquareId,
    virtualBoard: VirtualBoard,
  ): SquareId[] {
    // const [row, col] = Piece.sqIdToRowCol(sqId);
    const top = this.checkMovesBreak(virtualBoard, (r, c, i) => [r + i, c]);
    const right = this.checkMovesBreak(virtualBoard, (r, c, i) => [r, c + i]);
    const bottom = this.checkMovesBreak(virtualBoard, (r, c, i) => [r - i, c]);
    const left = this.checkMovesBreak(virtualBoard, (r, c, i) => [r, c - i]);

    return [...top, ...right, ...bottom, ...left];
  }

  getValidDiagonalMoves(
    _sqId: SquareId,
    virtualBoard: VirtualBoard,
  ): SquareId[] {
    // const [row, col] = Piece.sqIdToRowCol(sqId);
    const tl = this.checkMovesBreak(virtualBoard, (r, c, i) => [r + i, c - i]);
    const tr = this.checkMovesBreak(virtualBoard, (r, c, i) => [r + i, c + i]);
    const br = this.checkMovesBreak(virtualBoard, (r, c, i) => [r - i, c + i]);
    const bl = this.checkMovesBreak(virtualBoard, (r, c, i) => [r - i, c - i]);
    // console.log(sqId)

    const intialMoves = [...tl, ...tr, ...br, ...bl];
    // safe means that they don't cause the piece's king's "checkmate"
    // if is here so we don't cause an infinite loop

    // return safeMoves;
    return intialMoves;
  }

  // checks of the potential move causes the piece's king to be on a check
  // that's obviously an illegal move
  // analyze board if the piece has moved to sqId
  // find the king, figure out where the enemy can move and see if the king is in danger
  checkForCheckmate(sqId: SquareId, virtualBoard: VirtualBoard) {
    // console.log("-beg-");
    // console.log("this.id", virtualBoard[this.id]);
    // console.log("sqId", virtualBoard[sqId]);
    // sqId - where we want to go
    // for a minute, change the virtual board. We'll return it to its original state
    // before exiting the function

    // save piece that may be where we want to move, so we can populate it later
    const otherPieceBuff = virtualBoard[sqId];
    // we remove the current position of the piece
    delete virtualBoard[this.id];
    // we move the piece to sqId
    virtualBoard[sqId] = this;

    let kingPos: SquareId;
    const dangerougSquares: SquareId[] = [];
    Object.entries(virtualBoard).forEach(([id, piece]) => {
      // console.log(id, piece);
      if (piece.color !== this.color) {
        dangerougSquares.push(
          ...piece.getValidMoves(id as SquareId, virtualBoard),
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
    return !dangerougSquares.includes(kingPos);

    // reverting virtualBoard to normal state
  }
}

export default Piece;
