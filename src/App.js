import React from 'react';
import { observable, decorate } from 'mobx';
import Game from './Game/Game';
import 'babel-polyfill';

// const GAME_ID = 'ABC123';

class Store {
  value = 0;
}

decorate(Store, {
  value: observable,
});

const store = new Store();

const App = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const gameSlug = queryParams.get('game') || undefined;
  return <Game store={store} gameSlug={gameSlug} />;
};

export default App;
