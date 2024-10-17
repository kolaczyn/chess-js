import Piece from './Piece.js';
import { Color, Figure, SquareId, VirtualBoard } from '../types';

class Rook extends Piece {
  name: Figure;
  constructor(color: Color, hasMoved: boolean, id: SquareId) {
    super(color, hasMoved, id);
    this.name = 'rook';
  }

  getValidMoves(
    sqId: SquareId,
    virtualBoard: VirtualBoard,
    checkForCheckmate: boolean,
  ) {
    const moves = this.getValidHorizontalMoves(sqId, virtualBoard);
    if (checkForCheckmate) {
      return moves.filter((id) => this.checkForCheckmate(id, virtualBoard));
    }
    return moves;
  }
}

export default Rook;
