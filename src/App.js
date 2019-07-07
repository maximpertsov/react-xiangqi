import React from 'react';
import Game from './Game/Game';
import 'babel-polyfill';

const GAME_ID = 'ABC123';

const App = () => {
  const path = window.location.pathname.replace(/^\/|\/$/g, '');

  switch (path) {
    case '':
      console.log(`Game slug: ${GAME_ID}`);
      return <Game gameSlug={GAME_ID} />;
    default:
      console.log(`Game slug: ${path}`);
      return <Game gameSlug={path} />;
  }
};

export default App;
