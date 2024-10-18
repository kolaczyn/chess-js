import { FILE, FileRank, RANK, SquareId } from '../types.ts';

export const sqIdToFileRank = (squareId: SquareId): FileRank => {
  const [rank, file] = squareId.split('-');

  const fileNum = parseInt(file);
  const rankNum = parseInt(rank);

  return {
    file: FILE[fileNum],
    rank: RANK[rankNum],
  };
};
