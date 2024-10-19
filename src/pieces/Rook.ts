import Piece from './Piece.js';
import {
  BoardInfo,
  Color,
  Figure,
  IPiece,
  SquareId,
  VirtualBoard,
} from '../types';

class Rook extends Piece implements IPiece {
  name: Figure;
  constructor(color: Color, hasMoved: boolean, id: SquareId) {
    super(color, hasMoved, id);
    this.name = 'rook';
  }

  getValidMoves(
    sqId: SquareId,
    virtualBoard: VirtualBoard,
    boardInfo: BoardInfo,
    checkForCheckmate: boolean,
  ) {
    const moves = this.getValidHorizontalMoves(sqId, virtualBoard);
    if (checkForCheckmate) {
      return moves.filter((id) =>
        this.checkForCheckmate(id, virtualBoard, boardInfo),
      );
    }
    return moves;
  }
}

export default Rook;
