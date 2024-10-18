import { SquareId } from '../types.ts';

export const idToHumRead = (id: SquareId) => {
  let [row, col] = id.split('-');
  // @ts-expect-error
  row = parseInt(row) + 1;
  col = String.fromCharCode('A'.charCodeAt(0) + parseInt(col));
  return `${row}-${col}`;
};
