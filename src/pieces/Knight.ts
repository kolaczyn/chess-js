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
import { tagRegular, tagRegularOne } from '../utils/tagMove.ts';

class Knight extends Piece implements IPiece {
  name: Figure;
  constructor(color: Color, id: SquareId, vb: VirtualBoard) {
    super(color, id, vb);
    this.name = 'knight';
  }

  getValidMoves(
    _sqId: SquareId,
    boardInfo: BoardInfo,
    checkForCheckmate: boolean,
  ): TaggedSquareId[] {
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
      return tagRegular(
        moves.filter((id) =>
          this.checkForCheckmate(tagRegularOne(id), boardInfo),
        ),
      );
    }

    return tagRegular([...moves]);
  }
}

export default Knight;
