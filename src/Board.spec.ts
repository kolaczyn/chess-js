import { afterEach, describe, expect, it } from 'vitest';
import initialBoardState, { initialBoardInfo } from './initialBoardState.ts';
import Board from './Board.ts';
import fs from 'fs/promises';
import { screen } from '@testing-library/dom';

const loadHtml = () =>
  fs.readFile(`${import.meta.dirname}/../index.html`, 'utf8');

const setup = async () => {
  document.body.innerHTML = await loadHtml();

  new Board(initialBoardState, initialBoardInfo);
  const historyEl = screen.getByTestId('notification-sink');
  const getSquare = (row: number, col: number): HTMLElement | null =>
    screen.getByTestId(`square-${row}-${col}`);

  const getValidMoves = () => {
    const validMoves = document.querySelectorAll('.square--valid-move');
    const validMovesIds = [...validMoves].map(
      (el) => el.getAttribute('data-testid')!,
    );
    return validMovesIds;
  };

  return {
    historyEl,
    getSquare,
    getValidMoves,
  };
};

describe('board', async () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('shows valid moves', async () => {
    const { getSquare, getValidMoves } = await setup();

    // no valid moves shown, because nothing is pressed
    expect(getValidMoves()).toMatchInlineSnapshot(`[]`);

    // pawn valid moves
    getSquare(1, 4)!.click();

    expect(getValidMoves()).toMatchInlineSnapshot(`
      [
        "square-3-4",
        "square-2-4",
      ]
    `);

    // knight valid moves
    getSquare(0, 1)!.click();

    expect(getValidMoves()).toMatchInlineSnapshot(`
      [
        "square-2-0",
        "square-2-2",
      ]
    `);

    //   rook valid moves
    getSquare(0, 0)!.click();
    // nothing, because rook is blocked on all sides
    expect(getValidMoves()).toMatchInlineSnapshot(`[]`);

    // black pawn valid moves - can't move because it's whites' turn
    getSquare(6, 4)!.click();
    expect(getValidMoves()).toMatchInlineSnapshot(`[]`);
  });

  it('shows history', async () => {
    const { historyEl, getSquare } = await setup();

    expect(historyEl.textContent).toBe('');

    getSquare(1, 4)!.click();
    getSquare(3, 4)!.click();

    expect(historyEl.textContent).toBe('2-E 4-E');
  });
});
