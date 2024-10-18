import Piece from './Piece';
import { Color, Figure, PosId, SquareId, VirtualBoard } from '../types';

class King extends Piece {
  name: Figure;
  constructor(color: Color, hasMoved: boolean, id: SquareId) {
    super(color, hasMoved, id);
    this.name = 'king';
  }

  // for now there is no checkmate and castling as of now
  getValidMoves(
    _sqId: SquareId,
    virtualBoard: VirtualBoard,
    checkForCheckmate: boolean,
  ): SquareId[] {
    const validMoves: SquareId[] = [];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if ((i || j) && Piece.isInRange(this.row + i, this.col + j)) {
          const potentialPiece = Piece.isSquareOccupied(
            (this.row + i) as PosId,
            (this.col + j) as PosId,
            virtualBoard,
          );
          if (potentialPiece) {
            if (potentialPiece !== this.color) {
              validMoves.push(`${this.row + i}-${this.col + j}` as SquareId);
            }
          } else {
            validMoves.push(`${this.row + i}-${this.col + j}` as SquareId);
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
