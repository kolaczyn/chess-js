import Piece from './Piece';
import {
  BoardInfo,
  Color,
  Figure,
  IPiece,
  SquareId,
  VirtualBoard,
} from '../types';

class Knight extends Piece implements IPiece {
  name: Figure;
  constructor(color: Color, hasMoved: boolean, id: SquareId, vb: VirtualBoard) {
    super(color, hasMoved, id, vb);
    this.name = 'knight';
  }

  getValidMoves(
    _sqId: SquareId,
    boardInfo: BoardInfo,
    checkForCheckmate: boolean,
  ) {
    const moves: SquareId[] = [];
    // I don't like it; find another way
    moves.push(...this.checkMoves((r, c, _i) => [r - 2, c - 1]));
    moves.push(...this.checkMoves((r, c, _i) => [r - 2, c + 1]));
    moves.push(...this.checkMoves((r, c, _i) => [r + 2, c - 1]));
    moves.push(...this.checkMoves((r, c, _i) => [r + 2, c + 1]));

    moves.push(...this.checkMoves((r, c, _i) => [r - 1, c - 2]));
    moves.push(...this.checkMoves((r, c, _i) => [r - 1, c + 2]));
    moves.push(...this.checkMoves((r, c, _i) => [r + 1, c - 2]));
    moves.push(...this.checkMoves((r, c, _i) => [r + 1, c + 2]));

    if (checkForCheckmate) {
      return moves.filter((id) => this.checkForCheckmate(id, boardInfo));
    }

    return [...moves];
  }
}

export default Knight;
