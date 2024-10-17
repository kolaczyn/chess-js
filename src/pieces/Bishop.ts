import Piece from './Piece';

class Bishop extends Piece {
  constructor(color, hasMoved, id) {
    super(color, hasMoved, id);
    this.name = 'bishop';
    // if (checkForCheckmate){
    //   let safeMoves = intialMoves.filter((id) =>
    //   );
    // }

    // this.getValidMoves = this.getValidDiagonalMoves;
  }

  getValidMoves(sqId, virtualBoard, checkForCheckmate) {
    const moves = this.getValidDiagonalMoves(sqId, virtualBoard);
    if (checkForCheckmate) {
      return moves.filter((id) => this.checkForCheckmate(id, virtualBoard));
    }
    return moves;
  }
}

export default Bishop;
