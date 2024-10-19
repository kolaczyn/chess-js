import Piece from './Piece.js';
import {
  BoardInfo,
  Color,
  Figure,
  IPiece,
  SquareId,
  VirtualBoard,
} from '../types';

class Queen extends Piece implements IPiece {
  name: Figure;
  constructor(color: Color, hasMoved: boolean, id: SquareId, vb: VirtualBoard) {
    super(color, hasMoved, id, vb);
    this.name = 'queen';
  }

  getValidMoves(
    sqId: SquareId,
    boardInfo: BoardInfo,
    checkForCheckmate: boolean,
  ) {
    const moves = [
      ...this.getValidDiagonalMoves(sqId),
      ...this.getValidHorizontalMoves(sqId),
    ];
    if (checkForCheckmate) {
      return moves.filter((id) => this.checkForCheckmate(id, boardInfo));
    }
    return moves;
  }
}

export default Queen;
