class Piece {
  constructor(color, hasMoved, id) {
    this.color = color;
    this.hasMoved = hasMoved;
    this.id = id;
    // we don't care if bishop or knight has moved
    // I might do something like this in the future:
    // if (hasMoved !== undefined){
    //   this.hasMoved=this.hasMoved
    // }
  }

  get row() {
    return parseInt(this.id.split('-')[0]);
  }

  get col() {
    return parseInt(this.id.split('-')[1]);
  }

  static sqIdToRowCol(sqId) {
    const [row, col] = sqId.split('-');
    return [parseInt(row), parseInt(col)];
  }

  static isInRange(row, col) {
    return row >= 0 && row <= 7 && col >= 0 && col <= 7;
  }

  static isSquareOccupied(row, col, virtualBoard) {
    const piece = virtualBoard[`${row}-${col}`];
    if (piece) {
      return piece.color;
    }
    return '';
  }

  static rowColToSqId(row, col) {
    return `${row}-${col}`;
  }

  // definitely will have to refactor this
  // helper function
  // it stops when it encourters an obstacle
  checkMovesBreak(virtualBoard, calculateSquare) {
    const validMoves = [];
    for (let i = 1; i < 8; i++) {
      const checkedSquare = calculateSquare(this.row, this.col, i);
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
  checkMoves(virtualBoard, calculateSquare) {
    const validMoves = [];
    const checkedSquare = calculateSquare(this.row, this.col);
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

  getValidHorizontalMoves(sqId, virtualBoard) {
    const [row, col] = Piece.sqIdToRowCol(sqId);
    const top = this.checkMovesBreak(virtualBoard, (r, c, i) => [r + i, c]);
    const right = this.checkMovesBreak(virtualBoard, (r, c, i) => [r, c + i]);
    const bottom = this.checkMovesBreak(virtualBoard, (r, c, i) => [r - i, c]);
    const left = this.checkMovesBreak(virtualBoard, (r, c, i) => [r, c - i]);

    return [...top, ...right, ...bottom, ...left];
  }

  getValidDiagonalMoves(sqId, virtualBoard) {
    const [row, col] = Piece.sqIdToRowCol(sqId);
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
  checkForCheckmate(sqId, virtualBoard) {
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

    let kingPos;
    const dangerougSquares = [];
    Object.entries(virtualBoard).forEach(([id, piece]) => {
      // console.log(id, piece);
      if (piece.color !== this.color) {
        dangerougSquares.push(...piece.getValidMoves(id, virtualBoard));
      } else if (piece.name === 'king') {
        kingPos = id;
      }
    });
    // cleaning up
    delete virtualBoard[sqId];
    virtualBoard[this.id] = this;
    if (otherPieceBuff !== undefined) {
      virtualBoard[sqId] = otherPieceBuff;
    }
    return !dangerougSquares.includes(kingPos);

    // reverting virtualBoard to normal state
  }
}

export default Piece;
