const Piece = require("./Piece");

class Queen extends Piece {
  constructor(color, hasMoved, id) {
    super(color, hasMoved, id);
    this.name = "queen";
  }
  getValidMoves(sqId, virtualBoard, checkForCheckmate) {
    let moves = [
      ...this.getValidDiagonalMoves(sqId, virtualBoard),
      ...this.getValidHorizontalMoves(sqId, virtualBoard),
    ];
    if (checkForCheckmate) {
      return moves.filter((id) => {
        return this.checkForCheckmate(id, virtualBoard);
      });
    }
    return moves;
  }
}

module.exports = Queen;
