import Piece from "./Piece";

class Pawn extends Piece {
  constructor(color, hasMoved, id) {
    super(color, false, id);
    this.name = 'pawn';
  }

  // this is very messy, will have to come up with something better
  // also, implement attacking and en passant
  getValidMoves(sqId, virtualBoard, checkForCheckmate) {
    const out = [];
    const moveSquaresToCheck = [];
    // attacks need to be checked differently, because pawn is weird
    const attackSquaresToCheck = [];
    let direction;
    if (this.color === 'white') {
      direction = 1;
    } else {
      direction = -1;
    }

    // this will have to do for now
    const move1 = `${this.row + direction}-${this.col}`;
    const move2 = `${this.row + direction * 2}-${this.col}`;

    const move1Target = virtualBoard[move1];
    const move2Target = virtualBoard[move2];

    const attack1 = `${this.row + direction}-${this.col - 1}`;
    const attack2 = `${this.row + direction}-${this.col + 1}`;

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
