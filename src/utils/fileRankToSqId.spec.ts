import { describe, expect, test } from 'vitest';
import { FileRank, SquareId } from '../types.ts';
import { fileRankToSqId, toSqId } from './fileRankToSqId.ts';

export const fileRankSquareTestCases: [SquareId, FileRank][] = [
  [
    '7-0',
    {
      file: 'a',
      rank: '8',
    },
  ],
  [
    '2-1',
    {
      file: 'b',
      rank: '3',
    },
  ],
  [
    '3-6',
    {
      file: 'g',
      rank: '4',
    },
  ],
];

describe('converter', () => {
  test.each(fileRankSquareTestCases)(
    'converts file rank to square id',
    (expected, fileRank) => {
      expect(fileRankToSqId(fileRank)).toMatchObject(expected);
    },
  );

  test.each(fileRankSquareTestCases)(
    'converts file rank to square id (shorthand)',
    (expected, { file, rank }) => {
      expect(toSqId(file, rank)).toMatchObject(expected);
    },
  );
});
