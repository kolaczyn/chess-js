import { Figure } from '../types.ts';
import Rook from '../pieces/Rook.ts';
import Knight from '../pieces/Knight.ts';
import Bishop from '../pieces/Bishop.ts';
import Queen from '../pieces/Queen.ts';
import King from '../pieces/King.ts';
import Pawn from '../pieces/Pawn.ts';

export const stringToClass = (s: Figure) => {
  switch (s) {
    case 'rook':
      return Rook;
    case 'knight':
      return Knight;
    case 'bishop':
      return Bishop;
    case 'queen':
      return Queen;
    case 'king':
      return King;
    case 'pawn':
      return Pawn;
    default:
      throw new Error('Invalid piece class name.');
  }
};
