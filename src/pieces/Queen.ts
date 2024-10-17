import Piece from './Piece.js';
import { Color, Figure, SquareId, VirtualBoard } from '../types';

class Queen extends Piece {
  name: Figure;
  constructor(color: Color, hasMoved: boolean, id: SquareId) {
    super(color, hasMoved, id);
    this.name = 'queen';
  }

  getValidMoves(
    sqId: SquareId,
    virtualBoard: VirtualBoard,
    checkForCheckmate: boolean,
  ) {
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
