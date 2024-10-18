import { expect, test } from 'vitest';
import { sqIdToFileRank } from './sqIdToFileRank.ts';
import { fileRankSquareTestCases } from './fileRankToSqId.spec.ts';

test.each(fileRankSquareTestCases)(
  'converts square id to file and rank',
  (sqId, expected) => {
    expect(sqIdToFileRank(sqId)).toMatchObject(expected);
  },
);
