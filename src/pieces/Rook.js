const Piece = require('./Piece');

class Rook extends Piece {
  constructor(color, hasMoved, id) {
    super(color, hasMoved, id);
    this.name = 'rook';
  }

  getValidMoves(sqId, virtualBoard, checkForCheckmate) {
    const moves = this.getValidHorizontalMoves(sqId, virtualBoard);
    if (checkForCheckmate) {
      return moves.filter((id) => this.checkForCheckmate(id, virtualBoard));
    }
    return moves;
  }
}

module.exports = Rook;
