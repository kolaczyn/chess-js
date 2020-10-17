const Piece = require("./Piece");

class Queen extends Piece {
  constructor(color, hasMoved, id) {
    super(color, hasMoved, id);
    this.name = "queen";
  }
  getValidMoves(sqId, virtualBoard) {
    return [
      ...this.getValidDiagonalMoves(sqId, virtualBoard),
      ...this.getValidHorizontalMoves(sqId, virtualBoard),
    ];
  }
}

module.exports = Queen;
