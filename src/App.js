import React from 'react';
import Game from './Game/Game';
import 'babel-polyfill';

// const GAME_ID = 'ABC123';

const App = () => {
  const path = window.location.pathname.replace(/^\/|\/$/g, '');

  switch (path) {
    case '':
      return <Game />;
    default:
      return <Game gameSlug={path} />;
  }
};

export default App;
