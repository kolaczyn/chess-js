import { PosId, VirtualBoard } from '../types.ts';

export class BoardHelpers {
  virtualBoard: VirtualBoard;

  constructor(virtualBoard: VirtualBoard) {
    this.virtualBoard = virtualBoard;
  }

  isSquareOccupied(row: PosId, col: PosId) {
    const piece = this.virtualBoard[`${row}-${col}`];
    if (piece) {
      return piece.color;
    }
    return '';
  }
}
