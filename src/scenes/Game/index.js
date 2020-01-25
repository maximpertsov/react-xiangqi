import React from 'react';
import GameClient from './components/GameClient';
import GameInteraction from './components/GameInteraction';
import GameView from './components/GameView';

const Game = () => {
  return (
    <div>
      <GameClient />
      <GameInteraction />
      <GameView />
    </div>
  );
};

export default Game;
