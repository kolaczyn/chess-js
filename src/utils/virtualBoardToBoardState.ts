import { BoardState, SquareId, VirtualBoard } from '../types.ts';

export const virtualBoardToBoardState = (
  virtualBoard: VirtualBoard,
): BoardState => {
  const boardState: BoardState = {};
  for (const [id, piece] of Object.entries(virtualBoard)) {
    boardState[id as SquareId] = `${piece.color}-${piece.name}`;
  }
  return boardState;
};
