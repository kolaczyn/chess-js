import Piece from './Piece';
import { Color, Figure, SquareId, VirtualBoard } from '../types';

class Pawn extends Piece {
  name: Figure;
  constructor(color: Color, _hasMoved: boolean, id: SquareId) {
    super(color, false, id);
    this.name = 'pawn';
  }

  // this is very messy, will have to come up with something better
  // also, implement attacking and en passant
  getValidMoves(
    _sqId: SquareId,
    virtualBoard: VirtualBoard,
    checkForCheckmate: boolean,
  ): SquareId[] {
    const out: SquareId[] = [];
    // attacks need to be checked differently, because pawn is weird
    let direction: 1 | -1;
    if (this.color === 'white') {
      direction = 1;
    } else {
      direction = -1;
    }

    // this will have to do for now
    const move1 = `${this.row + direction}-${this.col}` as SquareId;
    const move2 = `${this.row + direction * 2}-${this.col}` as SquareId;

    const move1Target = virtualBoard[move1];
    const move2Target = virtualBoard[move2];

    const attack1 = `${this.row + direction}-${this.col - 1}` as SquareId;
    const attack2 = `${this.row + direction}-${this.col + 1}` as SquareId;

    const attack1Target = virtualBoard[attack1];
    const attack2Target = virtualBoard[attack2];

    if (attack1Target && attack1Target.color != this.color) {
      out.push(attack1);
    }
    if (attack2Target && attack2Target.color != this.color) {
      out.push(attack2);
    }
    if (!move1Target) {
      out.push(move1);
      if (!move2Target && !this.hasMoved) {
        out.push(move2);
      }
    }
    if (checkForCheckmate) {
      return out.filter((id) => this.checkForCheckmate(id, virtualBoard));
    }

    return out;
  }
}

export default Pawn;
