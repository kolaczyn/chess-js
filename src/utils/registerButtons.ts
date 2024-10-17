import { deleteGame } from './gameSave.ts';

export const registerButtons = () => {
  const newGameButton = document.querySelector('#new-game-button')!;

  newGameButton.addEventListener('click', () => {
    deleteGame();
    window.location.reload();
  });
};
