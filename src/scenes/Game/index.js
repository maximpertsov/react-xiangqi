import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import GameClient from './components/GameClient';
import GameInteraction from './components/GameInteraction';
import GameView from './components/GameView';

const Game = () => {
  // TODO: make a selector to check if moves are loaded/ready
  const moves = useSelector(state => state.moves);

  const ready = useCallback(() => {
    if (moves.length === 0) return false;
    if (moves[0].board === undefined) return false;

    return true;
  }, [moves]);

  return (
    <div>
      <GameClient />
      {ready && <GameInteraction />}
      {ready && <GameView />}
    </div>
  );
};

export default Game;
