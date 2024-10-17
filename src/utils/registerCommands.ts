import { deleteGame } from './gameSave.ts';

type AppCommands = {
  discardGame: () => void;
  allCommands: string[];
};

type WrappedCommands = {
  commands: AppCommands;
};

const getCommands = (): WrappedCommands =>
  // @ts-expect-error
  window;

export const registerCommands = () => {
  getCommands().commands = {} as AppCommands;

  getCommands().commands.discardGame = deleteGame;

  const commands = Object.keys(getCommands().commands);
  getCommands().commands.allCommands = [...commands, 'allCommands'];
};
