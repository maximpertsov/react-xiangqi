import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useEventListener from '@use-it/event-listener';
import sample from 'lodash/sample';

import { makeMove, selectMove } from 'actions';
import {
  getLastMove,
  getPreviousMove,
  getNextMove,
  getNextMoveColor,
} from 'reducers';

const GameInteraction = () => {
  const dispatch = useDispatch();
  const autoMove = useSelector(state => state.autoMove);
  const lastMove = useSelector(state => getLastMove(state));
  const nextMove = useSelector(state => getNextMove(state));
  const nextMoveColor = useSelector(state => getNextMoveColor(state));
  const previousMove = useSelector(state => getPreviousMove(state));

  useEffect(
    () => {
      setTimeout(() => {
        if (lastMove.legalMoves === undefined) return;
        if (!autoMove.includes(nextMoveColor)) return;

        const randomMove = sample(lastMove.legalMoves);
        dispatch(makeMove({ move: randomMove, pending: false }));
      }, 1000);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [autoMove, dispatch, lastMove.legalMoves, nextMoveColor],
  );

  useEventListener('keydown', ({ key }) => {
    switch (key) {
      case 'ArrowLeft':
        dispatch(selectMove({ moveId: previousMove.id }));
        break;
      case 'ArrowRight':
        dispatch(selectMove({ moveId: nextMove.id }));
        break;
      default:
        break;
    }
  });

  return null;
};

export default GameInteraction;
