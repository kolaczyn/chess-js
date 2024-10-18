import { expect, test } from 'vitest';
import { sqIdToFileRank } from './sqIdToFileRank.ts';
import { FileRank, SquareId } from '../types.ts';

const testCase: [SquareId, FileRank][] = [
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

test.each(testCase)('converts square id to file and rank', (sqId, expected) => {
  expect(sqIdToFileRank(sqId)).toMatchObject(expected);
});
