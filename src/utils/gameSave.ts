import { BoardInfo, BoardState, VirtualBoard } from '../types.ts';
import { virtualBoardToBoardState } from './virtualBoardToBoardState.ts';

const LOCAL_STORAGE_KEY = 'gameSave';

type GameSave = {
  boardState: BoardState;
  boardInfo: BoardInfo;
};

export const saveGame = (virtualBoard: VirtualBoard, boardInfo: BoardInfo) => {
  const boardState = virtualBoardToBoardState(virtualBoard);
  const gameSave: GameSave = { boardState, boardInfo };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameSave));
};

export const loadGame = (): GameSave | null => {
  const gameSave = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!gameSave) return null;
  const data = JSON.parse(gameSave) as GameSave;
  return data;
};

export const deleteGame = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
