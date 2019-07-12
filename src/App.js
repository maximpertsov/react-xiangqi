import React from 'react';
import { observable } from 'mobx';
import Game from './Game/Game';
import 'babel-polyfill';

// const GAME_ID = 'ABC123';

const store = observable.object({
  value: 0,

  get valuePlusOne() {
    return this.value + 1;
  },
});

const App = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const gameSlug = queryParams.get('game') || undefined;
  return <Game store={store} gameSlug={gameSlug} />;
};

export default App;
