type Piece = 'K' | 'Q' | 'R' | 'B' | 'N';

type Takes = 'x' | '';

type Check = '+' | '#';

type Castling = 'O-O' | 'O-O-O';

type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
type ToSquare = `${File}${Rank}`;
// There also can be double disambiguation, but I won't add it, because TS can't handle union this deep
type Disambiguation = File | Rank;

type ChessNotationStr =
  | `${Piece}${Disambiguation}${Takes}${ToSquare}${Check}`
  | Castling;

type ChessNotation =
  | {
      piece: Piece;
      takes: boolean;
      to: ToSquare;
      check: boolean;
      disambiguation: Disambiguation;
    }
  | {
      castling: true;
    };
