import { BoardState, Color, VirtualBoard } from '../types.ts';
import { virtualBoardToBoardState } from './virtualBoardToBoardState.ts';

const LOCAL_STORAGE_KEY = 'gameSave';

type GameSave = {
  whoseTurn: Color;
  boardState: BoardState;
};

export const saveGame = (virtualBoard: VirtualBoard, whoseTurn: Color) => {
  const boardState = virtualBoardToBoardState(virtualBoard);
  const gameSave: GameSave = { whoseTurn, boardState };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameSave));
};

export const loadGame = (): GameSave | null => {
  const gameSave = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!gameSave) return null;
  const data = JSON.parse(gameSave) as GameSave;
  return data;
};
