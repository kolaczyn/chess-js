const Piece = require("./Piece");

class Pawn extends Piece {
  constructor(color, hasMoved, id) {
    super(color, false, id);
    this.name = "pawn";
  }

  // this is very messy, will have to come up with something better
  // also, implement attacking and en passant
  getValidMoves(sqId, virtualBoard) {
    let out = [];
    let moveSquaresToCheck = [];
    // attacks need to be checked differently, because pawn is weird
    let attackSquaresToCheck = [];
    let direction;
    if (this.color === "white") {
      direction = 1;
    } else {
      direction = -1;
    }
    // if a pawn reaches the end, the next move may let him go beyond the board
    // look into that later
    moveSquaresToCheck.push(Piece.rowColToSqId(this.row + direction, this.col));
    if (!this.hasMoved) {
      moveSquaresToCheck.push(Piece.rowColToSqId(this.row + direction * 2, this.col));
    }
    // C style loop, hell yeah
    let i = 0;
    for (; i < moveSquaresToCheck.length; i++) {
      let { row, col } = moveSquaresToCheck[i];
      if (Piece.isSquareOccupied(row, col, virtualBoard)) {
        break;
      }
    }
    return moveSquaresToCheck.slice(0, i);
  }
}

module.exports = Pawn;
