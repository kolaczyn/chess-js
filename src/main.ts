import './sass/main.scss';

import Board from './Board';
import initialBoardState, { initialBoardInfo } from './initialBoardState';
import { loadGame } from './utils/gameSave.ts';
import { registerButtons } from './utils/registerButtons.ts';

const loadedGame = loadGame();
const board = loadedGame
  ? new Board(loadedGame.boardState, loadedGame.boardInfo)
  : new Board(initialBoardState, initialBoardInfo);

(window as any).board = board;

registerButtons();
