import './sass/main.scss';

import Board from './Board';
import initialBoardState from './initialBoardState';
import { loadGame } from './utils/gameSave.ts';

const loadedGame = loadGame();
if (loadedGame) {
  new Board(loadedGame.boardState, loadedGame.whoseTurn);
} else {
  new Board(initialBoardState);
}
