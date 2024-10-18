import { FILE, FileRank, Rank, RANK, SquareId, File } from '../types.ts';

export const fileRankToSqId = (fileRank: FileRank): SquareId => {
  const file = FILE.findIndex((x) => x === fileRank.file)!;
  const rank = RANK.findIndex((x) => x === fileRank.rank)!;
  return `${rank}-${file}` as SquareId;
};

export const toSqId = (file: File, rank: Rank): SquareId =>
  fileRankToSqId({ file, rank });
