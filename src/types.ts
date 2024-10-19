export type Figure = 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'pawn';
export type Color = 'white' | 'black';
export type FigureColor = `${Color}-${Figure}`;

export type PosId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type SquareId = `${PosId}-${PosId}`;

export type MoveTag = 'regular' | 'castle' | 'en-passant' | 'promotion';
export type TaggedSquareId = {
  id: SquareId;
  tag: MoveTag;
};

export interface IPiece {
  name: Figure;
  color: Color;
  getValidMoves(
    sqId: SquareId,
    boardInfo: BoardInfo,
    checkForCheckmate?: boolean,
  ): TaggedSquareId[];
}

export type BoardState = Partial<Record<SquareId, FigureColor>>;
export type VirtualBoard = Partial<Record<SquareId, IPiece>>;

export type CalculateSquare = (
  r: PosId,
  c: PosId,
  i: number,
) => [number, number];

export type PosArr = [PosId, PosId];

export type DidKingMove = {
  white: boolean;
  black: boolean;
};

export type DidRookMoveKey = `${'a' | 'h'}-${Color}`;

// should be named BoardState, but it's already used
export type BoardInfo = {
  whoseTurn: Color;
  didKingMove: DidKingMove;
  didRookMove: Record<DidRookMoveKey, boolean>;
};

export const FILE = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export type File = (typeof FILE)[number];
export const RANK = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
export type Rank = (typeof RANK)[number];
export type FileRank = {
  file: File;
  rank: Rank;
};
