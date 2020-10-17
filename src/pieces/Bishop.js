const Piece = require('./Piece')

class Bishop extends Piece {
    constructor(color, hasMoved, id) {
      super(color, hasMoved, id);
      this.name = "bishop";
      this.getValidMoves = this.getValidDiagonalMoves;
    }
}
module.exports = Bishop