import Piece from './Piece.js';
import {
  BoardInfo,
  Color,
  Figure,
  IPiece,
  SquareId,
  VirtualBoard,
} from '../types';
import { sqIdToFileRank } from '../utils/sqIdToFileRank.ts';

class Rook extends Piece implements IPiece {
  name: Figure;
  constructor(color: Color, id: SquareId, vb: VirtualBoard) {
    super(color, id, vb);
    this.name = 'rook';
  }

  moveCastle() {
    const color = this.color;
    const { rank, file } = sqIdToFileRank(this.id);

    if (color === 'white' && rank === '1' && file === 'a') {
      return ['c1', 'd1'];
    }
  }

  getValidMoves(
    sqId: SquareId,
    boardInfo: BoardInfo,
    checkForCheckmate: boolean,
  ) {
    const moves = this.getValidHorizontalMoves(sqId);
    if (checkForCheckmate) {
      return moves.filter((id) => this.checkForCheckmate(id, boardInfo));
    }
    return moves;
  }
}

export default Rook;
