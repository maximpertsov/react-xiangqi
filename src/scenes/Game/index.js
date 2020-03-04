import React from 'react';
import { useSelector } from 'react-redux';
import { getMoveCount } from 'reducers';
import GameClient from './components/GameClient';
import GameInteraction from './components/GameInteraction';
import GameView from './components/GameView';

const Game = () => {
  const moveCount = useSelector(state => getMoveCount(state));

  return (
    <div>
      <GameClient />
      {moveCount > -1 && <GameInteraction />}
      {moveCount > -1 && <GameView />}
    </div>
  );
};

export default Game;
