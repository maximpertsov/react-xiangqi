import React, { useState } from 'react';
import Game from './Game/Game';
import 'babel-polyfill';

// const GAME_ID = 'ABC123';

const App = () => {
  const [username, setUsername] = useState(undefined);

  const queryParams = new URLSearchParams(window.location.search);
  const gameSlug = queryParams.get('game') || undefined;
  return (
    <Game
      gameSlug={gameSlug}
      username={username}
      setUsername={setUsername}
    />
  );
};

export default App;
