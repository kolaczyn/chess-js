import { expect, test } from 'vitest';
import { chessNotationParser, Turn } from './chessNotationParser.ts';

const input = `\
1. e4 e5
2. Nf3 Nc6
3. Bb5 Nf6
4. Nc3 Bb5
5. 0-0 d5
6. exd5 Nxd5
7. Nxd5 Qxd5
8. Bxc6+ bxc6
9. c3 0-0
`;

const expected: Turn[] = [
  // 1
  {
    white: {
      check: null,
      disambiguation: null,
      figure: 'pawn',
      notation: 'e4',
      promotion: null,
      takes: false,
      to: 'e4',
    },
    black: {
      check: null,
      disambiguation: null,
      figure: 'pawn',
      notation: 'e5',
      promotion: null,
      takes: false,
      to: 'e5',
    },
  },
  // 2
  {
    white: {
      check: null,
      disambiguation: null,
      figure: 'knight',
      notation: 'Nf3',
      promotion: null,
      takes: false,
      to: 'f3',
    },
    black: {
      check: null,
      disambiguation: null,
      figure: 'knight',
      notation: 'Nc6',
      promotion: null,
      takes: false,
      to: 'c6',
    },
  },
  // 3
  {
    white: {
      check: null,
      disambiguation: null,
      figure: 'bishop',
      notation: 'Bb5',
      promotion: null,
      takes: false,
      to: 'b5',
    },
    black: {
      check: null,
      disambiguation: null,
      figure: 'knight',
      notation: 'Nf6',
      promotion: null,
      takes: false,
      to: 'f6',
    },
  },
  // 4
  {
    white: {
      check: null,
      disambiguation: null,
      figure: 'knight',
      notation: 'Nc3',
      promotion: null,
      takes: false,
      to: 'c3',
    },
    black: {
      check: null,
      disambiguation: null,
      figure: 'bishop',
      notation: 'Bb5',
      promotion: null,
      takes: false,
      to: 'b5',
    },
  },
  // 5
  {
    white: {
      castling: true,
      notation: '0-0',
    },
    black: {
      check: null,
      disambiguation: null,
      figure: 'pawn',
      notation: 'd5',
      promotion: null,
      takes: false,
      to: 'd5',
    },
  },
  // 6
  {
    white: {
      check: null,
      disambiguation: null,
      figure: 'pawn',
      notation: 'exd5',
      promotion: null,
      takes: true,
      to: 'd5',
    },
    black: {
      check: null,
      disambiguation: null,
      figure: 'knight',
      notation: 'Nxd5',
      promotion: null,
      takes: true,
      to: 'd5',
    },
  },
  // 7
  {
    white: {
      check: null,
      disambiguation: null,
      figure: 'knight',
      notation: 'Nxd5',
      promotion: null,
      takes: true,
      to: 'd5',
    },
    black: {
      check: null,
      disambiguation: null,
      figure: 'queen',
      notation: 'Qxd5',
      promotion: null,
      takes: true,
      to: 'd5',
    },
  },
  // 8
  {
    white: {
      check: 'check',
      disambiguation: null,
      figure: 'bishop',
      notation: 'Bxc6+',
      promotion: null,
      takes: true,
      to: 'c6',
    },
    black: {
      check: null,
      disambiguation: 'b',
      figure: 'pawn',
      notation: 'bxc6',
      promotion: null,
      takes: true,
      to: 'c6',
    },
  },
  // 9
  {
    white: {
      check: null,
      disambiguation: null,
      figure: 'pawn',
      notation: 'c3',
      promotion: null,
      takes: false,
      to: 'c3',
    },
    black: {
      castling: true,
      notation: '0-0',
    },
  },
];

const checkLine = (num: number) => {
  const result = chessNotationParser(input.split('\n')[num])[0];
  expect(result).toMatchObject(expected[num]);
};

test('adds 1 + 2 to equal 3', () => {
  checkLine(0);
  checkLine(1);
  checkLine(2);
  checkLine(3);
  checkLine(4);
  checkLine(5);
  checkLine(6);
  // TODO fix disambiguation
  // checkLine(7);
  checkLine(8);
});
