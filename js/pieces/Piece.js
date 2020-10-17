class Piece {
  constructor(color, hasMoved) {
    this.color = color;
    this.hasMoved = hasMoved;
    // we don't care if bishop or knight has moved
    // I might do something like this in the future:
    // if (hasMoved !== undefined){
    //   this.hasMoved=this.hasMoved
    // }
  }

  getValidMoves() {
    throw new Error("Not implemented yet.");
  }
  // definitely will have to refactor this
  // helper function
  // it stops when it encourters an obstacle
  checkMovesBreak(row, col, virtualBoard, calculateSquare) {
    let validMoves = [];
    for (let i = 1; i < 8; i++) {
      let checkedSquare = calculateSquare(row, col, i);
      if (isInRange(...checkedSquare)) {
        let potentialPiece = isSquareOccupied(...checkedSquare, virtualBoard);
        if (potentialPiece) {
          if (potentialPiece !== this.color) {
            validMoves.push(rowColToSqId(...checkedSquare));
          }
          break;
        } else validMoves.push(rowColToSqId(...checkedSquare));
      }
    }
    return validMoves;
  }
  // I should probably rewrite this so it accepts array of squares to check
  // and then checks them, returns array of valid squares
  checkMoves(row, col, virtualBoard, calculateSquare) {
    let validMoves = [];
    let checkedSquare = calculateSquare(row, col);
    if (isInRange(...checkedSquare)) {
      let potentialPiece = isSquareOccupied(...checkedSquare, virtualBoard);
      if (potentialPiece) {
        if (potentialPiece !== this.color) {
          validMoves.push(rowColToSqId(...checkedSquare));
        }
      } else validMoves.push(rowColToSqId(...checkedSquare));
    }
    return validMoves;
  }

  getValidHorizontalMoves(sqId, virtualBoard) {
    let [row, col] = sqIdToRowCol(sqId);
    let top = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r + i,
      c,
    ]);
    let right = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r,
      c + i,
    ]);
    let bottom = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r - i,
      c,
    ]);
    let left = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r,
      c - i,
    ]);

    return [...top, ...right, ...bottom, ...left];
  }

  getValidDiagonalMoves(sqId, virtualBoard) {
    let [row, col] = sqIdToRowCol(sqId);
    let tl = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r + i,
      c - i,
    ]);
    let tr = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r + i,
      c + i,
    ]);
    let br = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r - i,
      c + i,
    ]);
    let bl = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r - i,
      c - i,
    ]);

    return [...tl, ...tr, ...br, ...bl];
  }
}
