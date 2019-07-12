import React from 'react';
import Game from './Game/Game';
import { GameProvider } from './Game/GameContext';
import 'babel-polyfill';

// const GAME_ID = 'ABC123';

const App = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const gameSlug = queryParams.get('game') || undefined;
  return (
    <GameProvider>
      <Game gameSlug={gameSlug} />
    </GameProvider>
  );
};

export default App;
