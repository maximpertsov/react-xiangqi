import React from 'react';
import Game from './Game/Game';
import { GameState, gameState } from './Game/game-state';
import 'babel-polyfill';

// const GAME_ID = 'ABC123';

const App = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const gameSlug = queryParams.get('game') || undefined;
  return (
    <GameState.Provider value={gameState}>
      <Game gameSlug={gameSlug} />
    </GameState.Provider>
  );
};

export default App;
