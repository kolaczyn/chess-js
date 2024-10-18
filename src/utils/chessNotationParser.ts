import { Figure } from '../types.ts';

const PROMOTION_PIECE = ['Q', 'R', 'B', 'N'] as const;
type PromotionPiece = (typeof PROMOTION_PIECE)[number];

const FILE = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
type File = (typeof FILE)[number];

const RANK = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
type Rank = (typeof RANK)[number];

type Square = `${File}${Rank}`;
type Disambiguation = File | Rank | Square | null;

type Check = 'check' | 'checkmate' | null;

export type ChessNotation = (
  | {
      figure: Figure;
      takes: boolean;
      to: Square;
      check: Check;
      disambiguation: Disambiguation;
      promotion: PromotionPiece | null;
    }
  | {
      castling: true;
    }
) & {
  notation: string;
};

export type Turn = {
  white: ChessNotation;
  // keep in mind that black can be null if white is the last turn
  black: ChessNotation;
};

export const chessNotationParser = (input: string): Turn[] =>
  input.trim().split('\n').map(parseLine);

const parseLine = (line: string): Turn => {
  const withoutNumber = line.split('. ')[1];
  const [white, black] = withoutNumber.split(' ');
  return {
    white: parseTurn(white),
    black: parseTurn(black),
  };
};

const notationToFigure = (notation: string): Figure => {
  switch (notation) {
    case 'K':
      return 'king';
    case 'Q':
      return 'queen';
    case 'R':
      return 'rook';
    case 'B':
      return 'bishop';
    case 'N':
      return 'knight';
    default:
      return 'pawn';
  }
};

const checkOrCheckmate = (str: string): Check => {
  if (str.includes('+')) {
    return 'check';
  }
  if (str.includes('#')) {
    return 'checkmate';
  }
  return null;
};

const parseTurn = (str: string): ChessNotation => {
  if (str === '0-0' || str === '0-0-0') {
    return { castling: true, notation: str };
  }

  const to = str.replace('#', '').replace('+', '').slice(-2) as Square;
  const piece = str[0];
  const actualPiece = notationToFigure(piece);
  const check = checkOrCheckmate(str);
  const takes = str.includes('x');

  return {
    to,
    figure: actualPiece,
    notation: str,
    check,
    disambiguation: null,
    promotion: null,
    takes,
  };
};
