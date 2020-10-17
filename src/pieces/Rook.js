const Piece = require("./Piece");

class Rook extends Piece {
  constructor(color, hasMoved, id) {
    super(color, hasMoved, id);
    this.name = "rook";
    this.getValidMoves = this.getValidHorizontalMoves;
  }
}

module.exports = Rook;
