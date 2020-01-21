import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import useEventListener from '@use-it/event-listener';
import { makeMove, selectMove } from 'actions';
import {
  getLastMove,
  getPreviousMove,
  getNextMove,
  getNextMoveColor,
} from 'reducers';
import GameClient from './components/GameClient';
import GameView from './components/GameView';

const Game = () => {
  const dispatch = useDispatch();
  const autoMove = useSelector(state => state.autoMove);
  // TODO: make these individual consts
  const selectors = useSelector(
    state => ({
      // moves
      lastMove: getLastMove(state),
      nextMoveColor: getNextMoveColor(state),
      previousMove: getPreviousMove(state),
      nextMove: getNextMove(state),
    }),
    shallowEqual,
  );

  useEffect(
    () => {
      setTimeout(() => {
        if (autoMove.includes(selectors.nextMoveColor)) {
          const { board } = selectors.lastMove;
          const [fromSlot, toSlot] = board.randomMove(selectors.nextMoveColor);
          dispatch(makeMove({ fromSlot, toSlot, pending: false }));
        }}, 1000);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [autoMove, dispatch, selectors.nextMoveColor],
  );

  useEventListener('keydown', ({ key }) => {
    switch (key) {
      case 'ArrowLeft':
        dispatch(selectMove({ moveId: selectors.previousMove.id }));
        break;
      case 'ArrowRight':
        dispatch(selectMove({ moveId: selectors.nextMove.id }));
        break;
      default:
        break;
    }
  });

  return (
    <div>
      <GameClient />
      <GameView />
    </div>
  );
};

export default Game;
