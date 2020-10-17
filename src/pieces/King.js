const Piece = require('./Piece')

class King extends Piece {
    constructor(color, hasMoved, id) {
      super(color, hasMoved, id);
      this.name = "king";
    }
    // for now there is no checkmate and castling as of now
    getValidMoves(sqId, virtualBoard) {
      let [row, col] = Piece.sqIdToRowCol(sqId);
      let validMoves = [];
      let range = [-1, 0, 1];
      // there's probably a better way of doing it, but it's more JS-y than a C-style for loop
      // try to improve this algorithm
      range.forEach((i) => {
        range.forEach((j) => {
          // this way we don't check (0, 0) && a square is in range
          if ((i || j) && Piece.isInRange(row + i, col + j)) {
            let potentialPiece = Piece.isSquareOccupied(
              row + i,
              col + j,
              virtualBoard
            );
            if (potentialPiece) {
              if (potentialPiece !== this.color)
                validMoves.push(Piece.rowColToSqId(row + i, col + j));
            } else {
              validMoves.push(Piece.rowColToSqId(row + i, col + j));
            }
          }
        });
      });
      return validMoves;
    }
  }
  module.exports = King