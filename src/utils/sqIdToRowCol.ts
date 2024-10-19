import { PosId, SquareId } from '../types.ts';

export const sqIdToRowCol = (sqId: SquareId): [row: PosId, col: PosId] => {
  const [row, col] = sqId.split('-');
  return [parseInt(row), parseInt(col)] as [PosId, PosId];
};
