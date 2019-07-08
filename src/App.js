import React from 'react';
import Game from './Game/Game';
import 'babel-polyfill';

// const GAME_ID = 'ABC123';

const App = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const gameSlug = queryParams.get('game') || undefined;
  return <Game gameSlug={gameSlug} />;
};

export default App;
