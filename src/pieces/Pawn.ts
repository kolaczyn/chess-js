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
import { sqIdToFileRank } from '../utils/sqIdToFileRank.ts';
import { tagRegularOne } from '../utils/tagMove.ts';

class Pawn extends Piece implements IPiece {
  name: Figure;
  constructor(color: Color, id: SquareId, vb: VirtualBoard) {
    super(color, id, vb);
    this.name = 'pawn';
  }

  get hasMoved() {
    const color = this.color;
    const { rank } = sqIdToFileRank(this.id);
    if (color === 'white' && rank === '2') return false;
    if (color === 'black' && rank === '7') return false;
    return true;
  }

  // this is very messy, will have to come up with something better
  // also, implement attacking and en passant
  getValidMoves(
    _sqId: SquareId,
    boardInfo: BoardInfo,
    checkForCheckmate: boolean,
  ): TaggedSquareId[] {
    const out: TaggedSquareId[] = [];
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

    const move1Target = this.virtualBoard[move1];
    const move2Target = this.virtualBoard[move2];

    const attack1 = `${this.row + direction}-${this.col - 1}` as SquareId;
    const attack2 = `${this.row + direction}-${this.col + 1}` as SquareId;

    const attack1Target = this.virtualBoard[attack1];
    const attack2Target = this.virtualBoard[attack2];

    if (attack1Target && attack1Target.color != this.color) {
      out.push(tagRegularOne(attack1));
    }
    if (attack2Target && attack2Target.color != this.color) {
      out.push(tagRegularOne(attack2));
    }
    if (!move1Target) {
      out.push(tagRegularOne(move1));
      if (!move2Target && !this.hasMoved) {
        out.push(tagRegularOne(move2));
      }
    }
    if (checkForCheckmate) {
      return out.filter((id) => this.checkForCheckmate(id, boardInfo));
    }

    return out;
  }
}

export default Pawn;
