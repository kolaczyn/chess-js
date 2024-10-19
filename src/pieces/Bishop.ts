import Piece from './Piece';
import {
  BoardInfo,
  Color,
  Figure,
  IPiece,
  SquareId,
  TaggedSquareId,
  VirtualBoard,
} from '../types';

class Bishop extends Piece implements IPiece {
  name: Figure;
  constructor(color: Color, id: SquareId, vb: VirtualBoard) {
    super(color, id, vb);
    this.name = 'bishop';
  }

  getValidMoves(
    sqId: SquareId,
    boardInfo: BoardInfo,
    checkForCheckmate: boolean,
  ): TaggedSquareId[] {
    const moves = this.getValidDiagonalMoves(sqId);
    if (checkForCheckmate) {
      return moves.filter((id) => this.checkForCheckmate(id, boardInfo));
    }
    return moves;
  }
}

export default Bishop;
