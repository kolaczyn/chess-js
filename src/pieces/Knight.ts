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
  constructor(color: Color, hasMoved: boolean, id: SquareId) {
    super(color, hasMoved, id);
    this.name = 'knight';
  }

  getValidMoves(
    _sqId: SquareId,
    virtualBoard: VirtualBoard,
    boardInfo: BoardInfo,
    checkForCheckmate: boolean,
  ) {
    const moves: SquareId[] = [];
    // I don't like it; find another way
    moves.push(...this.checkMoves(virtualBoard, (r, c, _i) => [r - 2, c - 1]));
    moves.push(...this.checkMoves(virtualBoard, (r, c, _i) => [r - 2, c + 1]));
    moves.push(...this.checkMoves(virtualBoard, (r, c, _i) => [r + 2, c - 1]));
    moves.push(...this.checkMoves(virtualBoard, (r, c, _i) => [r + 2, c + 1]));

    moves.push(...this.checkMoves(virtualBoard, (r, c, _i) => [r - 1, c - 2]));
    moves.push(...this.checkMoves(virtualBoard, (r, c, _i) => [r - 1, c + 2]));
    moves.push(...this.checkMoves(virtualBoard, (r, c, _i) => [r + 1, c - 2]));
    moves.push(...this.checkMoves(virtualBoard, (r, c, _i) => [r + 1, c + 2]));

    if (checkForCheckmate) {
      return moves.filter((id) =>
        this.checkForCheckmate(id, virtualBoard, boardInfo),
      );
    }

    return [...moves];
  }
}

export default Knight;
