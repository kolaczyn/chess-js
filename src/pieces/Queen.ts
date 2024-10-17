import Piece from './Piece.js';

class Queen extends Piece {
  constructor(color, hasMoved, id) {
    super(color, hasMoved, id);
    this.name = 'queen';
  }

  getValidMoves(sqId, virtualBoard, checkForCheckmate) {
    const moves = [
      ...this.getValidDiagonalMoves(sqId, virtualBoard),
      ...this.getValidHorizontalMoves(sqId, virtualBoard),
    ];
    if (checkForCheckmate) {
      return moves.filter((id) => this.checkForCheckmate(id, virtualBoard));
    }
    return moves;
  }
}

export default Queen;
