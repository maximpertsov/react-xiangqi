import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useEventListener from '@use-it/event-listener';
import isEqual from 'lodash/isEqual';
import sample from 'lodash/sample';
import toPairs from 'lodash/toPairs';

import makeMove from 'actions/makeMove';
import actions from 'actions';
import {
  getLastMove,
  getPreviousMove,
  getNextMove,
  getNextMoveColor,
} from 'reducers';

const GameInteraction = () => {
  const dispatch = useDispatch();
  const autoMove = useSelector(state => state.autoMove, isEqual);
  const lastMove = useSelector(state => getLastMove(state), isEqual);
  const nextMove = useSelector(state => getNextMove(state), isEqual);
  const nextMoveColor = useSelector(state => getNextMoveColor(state));
  const previousMove = useSelector(state => getPreviousMove(state), isEqual);

  useEffect(
    () => {
      setTimeout(() => {
        if (lastMove.legalMoves === undefined) return;
        if (!autoMove.includes(nextMoveColor)) return;

        const [move, fen] = sample(toPairs(lastMove.legalMoves));
        dispatch(makeMove({ move, fen, pending: false }));
      }, 1000);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // TODO: update on simpler data
    [autoMove, dispatch, lastMove.legalMoves, nextMoveColor],
  );

  useEventListener('keydown', ({ key }) => {
    switch (key) {
      case 'ArrowLeft':
        dispatch(actions.game.selectedPosition.set(previousMove.id));
        break;
      case 'ArrowRight':
        dispatch(actions.game.selectedPosition.set(nextMove.id));
        break;
      default:
        break;
    }
  });

  return null;
};

export default GameInteraction;
