import React from 'react';
import { useSelector } from 'react-redux';
import { getHasInitialPlacement } from 'reducers';

import GameClient from './components/GameClient';
import GameInteraction from './components/GameInteraction';
import GameView from './components/GameView';

const Game = () => {
  const hasInitialPlacement = useSelector(state =>
    getHasInitialPlacement(state),
  );

  return (
    <div>
      <GameClient />
      {hasInitialPlacement && <GameInteraction />}
      {hasInitialPlacement && <GameView />}
    </div>
  );
};

export default Game;
