import Piece from './Piece';
import {
  BoardInfo,
  Color,
  Figure,
  File,
  PosId,
  SquareId,
  VirtualBoard,
} from '../types';
import { flags } from '../flags.ts';
import { toSqId } from '../utils/fileRankToSqId.ts';

class King extends Piece {
  name: Figure;
  constructor(color: Color, hasMoved: boolean, id: SquareId) {
    super(color, hasMoved, id);
    this.name = 'king';
  }

  getValidCastlingMovesDirection(
    virtualBoard: VirtualBoard,
    direction: 'left' | 'right',
  ): SquareId | null {
    const rank = this.color === 'white' ? '1' : '8';
    const filesToCheck: File[] =
      direction === 'left' ? ['b', 'c', 'd'] : ['f', 'g'];
    const sqIdsToCheck = filesToCheck.map((file) => toSqId(file, rank));

    const areAllFree = sqIdsToCheck.every((sqId) => {
      const [row, col] = Piece.sqIdToRowCol(sqId);
      const isFree = !Piece.isSquareOccupied(row, col, virtualBoard);
      return isFree;
    });

    if (areAllFree) {
      const kingFile = direction === 'left' ? 'c' : 'g';
      return toSqId(kingFile, rank);
    }
    return null;
  }

  getValidCastlingMoves(virtualBoard: VirtualBoard, boardInfo: BoardInfo) {
    if (!flags.castling) return [];

    const validMoves: SquareId[] = [];
    const color = this.color;

    const didKingMove = boardInfo.didKingMove[color];
    if (didKingMove) return [];

    const didLeftRookMove = boardInfo.didRookMove[`a-${color}`];
    const didRightRookMove = boardInfo.didRookMove[`h-${color}`];
    if (!didLeftRookMove) {
      const leftMove = this.getValidCastlingMovesDirection(
        virtualBoard,
        'left',
      );
      if (leftMove) {
        validMoves.push(leftMove);
      }
    }

    if (!didRightRookMove) {
      const rightMove = this.getValidCastlingMovesDirection(
        virtualBoard,
        'right',
      );
      if (rightMove) {
        validMoves.push(rightMove);
      }
    }

    return validMoves;
  }

  getValidRegularMoves(virtualBoard: VirtualBoard) {
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
    return validMoves;
  }

  getValidMoves(
    _sqId: SquareId,
    virtualBoard: VirtualBoard,
    boardInfo: BoardInfo,
    checkForCheckmate: boolean,
  ): SquareId[] {
    const validRegularMoves = this.getValidRegularMoves(virtualBoard);
    const validCastlingMoves = this.getValidCastlingMoves(
      virtualBoard,
      boardInfo,
    );

    console.log(validCastlingMoves);

    const validMoves = [...validRegularMoves, ...validCastlingMoves];

    if (checkForCheckmate) {
      return validMoves.filter((id) =>
        this.checkForCheckmate(id, virtualBoard, boardInfo),
      );
    }
    return validMoves;
  }
}

export default King;
