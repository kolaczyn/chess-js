import Piece from './Piece';

class King extends Piece {
  constructor(color, hasMoved, id) {
    super(color, hasMoved, id);
    this.name = 'king';
  }

  // for now there is no checkmate and castling as of now
  getValidMoves(sqId, virtualBoard, checkForCheckmate) {
    const validMoves = [];
    const range = [-1, 0, 1];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if ((i || j) && Piece.isInRange(this.row + i, this.col + j)) {
          const potentialPiece = Piece.isSquareOccupied(
            this.row + i,
            this.col + j,
            virtualBoard,
          );
          if (potentialPiece) {
            if (potentialPiece !== this.color) {
              validMoves.push(`${this.row + i}-${this.col + j}`);
            }
          } else {
            validMoves.push(`${this.row + i}-${this.col + j}`);
          }
        }
      }
    }
    if (checkForCheckmate) {
      return validMoves.filter((id) =>
        this.checkForCheckmate(id, virtualBoard),
      );
    }
    return validMoves;
  }
}

export default King;
