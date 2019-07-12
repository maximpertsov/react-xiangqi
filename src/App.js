import React from 'react';
import { observable, action } from 'mobx';
import { Provider } from 'mobx-react';
import Game from './Game/Game';
import 'babel-polyfill';

// const GAME_ID = 'ABC123';

const store = observable({
  selectedMoveIdx: 0,

  setSelectedMoveIdx(idx) {
    this.selectedMoveIdx = idx;
  },
}, {
  setSelectedMoveIdx: action,
});

const App = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const gameSlug = queryParams.get('game') || undefined;
  return (
    <Provider store={store}>
      <Game gameSlug={gameSlug} />
    </Provider>
  );
};

export default App;
