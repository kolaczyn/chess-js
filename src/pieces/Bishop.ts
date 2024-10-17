import Piece from './Piece';
import { Color, Figure, SquareId, VirtualBoard } from '../types';

class Bishop extends Piece {
  name: Figure;
  constructor(color: Color, hasMoved: boolean, id: SquareId) {
    super(color, hasMoved, id);
    this.name = 'bishop';
    // if (checkForCheckmate){
    //   let safeMoves = intialMoves.filter((id) =>
    //   );
    // }

    // this.getValidMoves = this.getValidDiagonalMoves;
  }

  getValidMoves(
    sqId: SquareId,
    virtualBoard: VirtualBoard,
    checkForCheckmate: boolean,
  ): SquareId[] {
    const moves = this.getValidDiagonalMoves(sqId, virtualBoard);
    if (checkForCheckmate) {
      return moves.filter((id) => this.checkForCheckmate(id, virtualBoard));
    }
    return moves;
  }
}

export default Bishop;
