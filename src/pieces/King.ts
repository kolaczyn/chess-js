import Piece from './Piece';
import {
  BoardInfo,
  Color,
  Figure,
  File,
  IPiece,
  PosId,
  SquareId,
  TaggedSquareId,
  VirtualBoard,
} from '../types';
import { flags } from '../flags.ts';
import { toSqId } from '../utils/fileRankToSqId.ts';
import { sqIdToRowCol } from '../utils/sqIdToRowCol.ts';
import { tagMove, tagRegular } from '../utils/tagMove.ts';

class King extends Piece implements IPiece {
  name: Figure;
  constructor(color: Color, id: SquareId, vb: VirtualBoard) {
    super(color, id, vb);
    this.name = 'king';
  }

  getValidCastlingMovesDirection(direction: 'left' | 'right'): SquareId | null {
    const rank = this.color === 'white' ? '1' : '8';
    const filesToCheck: File[] =
      direction === 'left' ? ['b', 'c', 'd'] : ['f', 'g'];
    const sqIdsToCheck = filesToCheck.map((file) => toSqId(file, rank));

    const areAllFree = sqIdsToCheck.every((sqId) => {
      const [row, col] = sqIdToRowCol(sqId);
      const isFree = !this.boardHelpers.isSquareOccupied(row, col);
      return isFree;
    });

    if (areAllFree) {
      const kingFile = direction === 'left' ? 'c' : 'g';
      return toSqId(kingFile, rank);
    }
    return null;
  }

  getValidCastlingMoves(boardInfo: BoardInfo) {
    if (!flags.castling) return [];

    const validMoves: TaggedSquareId[] = [];
    const color = this.color;

    const didKingMove = boardInfo.didKingMove[color];
    if (didKingMove) return [];

    const didLeftRookMove = boardInfo.didRookMove[`a-${color}`];
    const didRightRookMove = boardInfo.didRookMove[`h-${color}`];
    if (!didLeftRookMove) {
      const leftMove = this.getValidCastlingMovesDirection('left');
      if (leftMove) {
        validMoves.push({ id: leftMove, tag: 'castle-long', target: 'TODO' });
      }
    }

    if (!didRightRookMove) {
      const rightMove = this.getValidCastlingMovesDirection('right');
      if (rightMove) {
        validMoves.push({ id: rightMove, tag: 'castle-short', target: 'TODO' });
      }
    }

    return validMoves;
  }

  getValidRegularMoves() {
    const validMoves: SquareId[] = [];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if ((i || j) && Piece.isInRange(this.row + i, this.col + j)) {
          const potentialPiece = this.boardHelpers.isSquareOccupied(
            (this.row + i) as PosId,
            (this.col + j) as PosId,
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
    return tagRegular(validMoves);
  }

  getValidMoves(
    _sqId: SquareId,
    boardInfo: BoardInfo,
    checkForCheckmate: boolean,
  ): TaggedSquareId[] {
    const validRegularMoves = this.getValidRegularMoves();
    const validCastlingMoves = this.getValidCastlingMoves(boardInfo);

    const validMoves = [...validRegularMoves, ...validCastlingMoves];

    if (checkForCheckmate) {
      return validMoves.filter((id) => this.checkForCheckmate(id, boardInfo));
    }
    return validMoves;
  }
}

export default King;
