import Piece from './Piece';
import {
  BoardInfo,
  Color,
  Figure,
  IPiece,
  SquareId,
  VirtualBoard,
} from '../types';

class Bishop extends Piece implements IPiece {
  name: Figure;
  constructor(color: Color, hasMoved: boolean, id: SquareId) {
    super(color, hasMoved, id);
    this.name = 'bishop';
  }

  getValidMoves(
    sqId: SquareId,
    virtualBoard: VirtualBoard,
    boardInfo: BoardInfo,
    checkForCheckmate: boolean,
  ): SquareId[] {
    const moves = this.getValidDiagonalMoves(sqId, virtualBoard);
    if (checkForCheckmate) {
      return moves.filter((id) =>
        this.checkForCheckmate(id, virtualBoard, boardInfo),
      );
    }
    return moves;
  }
}

export default Bishop;
