import React from 'react';
import Game from './Game/Game';
import 'babel-polyfill';

const App = () => {
  const path = window.location.pathname.replace(/^\/|\/$/g, '');

  switch (path) {
    case '':
      return <Game />;
    default:
      return <Game />;
  }
};

export default App;
