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
    return parseInt(this.id.split("-")[0]);
  }
  get col() {
    return parseInt(this.id.split("-")[1]);
  }

  static sqIdToRowCol(sqId) {
    let [row, col] = sqId.split("-");
    return [parseInt(row), parseInt(col)];
  }

  static isInRange(row, col) {
    return 0 <= row && row <= 7 && 0 <= col && col <= 7;
  }

  static isSquareOccupied(row, col, virtualBoard) {
    let piece = virtualBoard[`${row}-${col}`];
    if (piece) {
      return piece.color;
    }
    return "";
  }

  static rowColToSqId(row, col) {
    return `${row}-${col}`;
  }

  // definitely will have to refactor this
  // helper function
  // it stops when it encourters an obstacle
  checkMovesBreak(virtualBoard, calculateSquare) {
    let validMoves = [];
    for (let i = 1; i < 8; i++) {
      let checkedSquare = calculateSquare(this.row, this.col, i);
      if (Piece.isInRange(...checkedSquare)) {
        let potentialPiece = Piece.isSquareOccupied(
          ...checkedSquare,
          virtualBoard
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
    let validMoves = [];
    let checkedSquare = calculateSquare(this.row, this.col);
    if (Piece.isInRange(...checkedSquare)) {
      let potentialPiece = Piece.isSquareOccupied(
        ...checkedSquare,
        virtualBoard
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
    
    let [row, col] = Piece.sqIdToRowCol(sqId);
    let top = this.checkMovesBreak(virtualBoard, (r, c, i) => [
      r + i,
      c,
    ]);
    let right = this.checkMovesBreak(virtualBoard, (r, c, i) => [
      r,
      c + i,
    ]);
    let bottom = this.checkMovesBreak(virtualBoard, (r, c, i) => [
      r - i,
      c,
    ]);
    let left = this.checkMovesBreak(virtualBoard, (r, c, i) => [
      r,
      c - i,
    ]);

    return [...top, ...right, ...bottom, ...left];
  }

  getValidDiagonalMoves(sqId, virtualBoard) {
    let [row, col] = Piece.sqIdToRowCol(sqId);
    let tl = this.checkMovesBreak(virtualBoard, (r, c, i) => [
      r + i,
      c - i,
    ]);
    let tr = this.checkMovesBreak(virtualBoard, (r, c, i) => [
      r + i,
      c + i,
    ]);
    let br = this.checkMovesBreak(virtualBoard, (r, c, i) => [
      r - i,
      c + i,
    ]);
    let bl = this.checkMovesBreak(virtualBoard, (r, c, i) => [
      r - i,
      c - i,
    ]);

    return [...tl, ...tr, ...br, ...bl];
  }
}

module.exports = Piece;
