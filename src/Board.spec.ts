import { describe, expect, it } from 'vitest';
import initialBoardState from './initialBoardState.ts';
import Board from './Board.ts';
import fs from 'fs/promises';
import { screen } from '@testing-library/dom';

const loadHtml = () =>
  fs.readFile(`${import.meta.dirname}/../index.html`, 'utf8');

const setup = async () => {
  document.body.innerHTML = await loadHtml();

  new Board(initialBoardState);
  const historyEl = screen.getByTestId('notification-sink');
  const getSquare = (row: number, col: number): HTMLElement | null =>
    screen.getByTestId(`square-${row}-${col}`);

  return {
    historyEl,
    getSquare,
  };
};

describe('board', async () => {
  it('shows history', async () => {
    const { historyEl, getSquare } = await setup();

    expect(historyEl.textContent).toBe('');

    getSquare(1, 4)!.click();
    getSquare(3, 4)!.click();

    expect(historyEl.textContent).toBe('2-E 4-E');
  });
});
