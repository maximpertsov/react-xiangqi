import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
import sample from 'lodash/sample';
import toPairs from 'lodash/toPairs';

import useEventListener from '@use-it/event-listener';
import actions from 'actions';
import makeMove from 'actions/makeMove';
import {
  getLastMove,
  getNextMoveFen,
  getNextMoveTeam,
  getPreviousMoveFen,
} from 'reducers';

const GameInteraction = () => {
  const dispatch = useDispatch();

  const autoMove = useSelector(state => state.autoMove, isEqual);
  const lastMove = useSelector(state => getLastMove(state), isEqual);
  const nextMoveFen = useSelector(state => getNextMoveFen(state), isEqual);
  const nextMoveTeam = useSelector(state => getNextMoveTeam(state));
  const previousMoveFen = useSelector(
    state => getPreviousMoveFen(state),
    isEqual,
  );

  useEffect(
    () => {
      setTimeout(() => {
        if (lastMove.legalMoves === undefined) return;
        if (!autoMove.includes(nextMoveTeam)) return;

        const [uci, fen] = sample(toPairs(lastMove.legalMoves));
        dispatch(makeMove({ uci, fen }));
      }, 1000);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // TODO: update on simpler data
    [autoMove, dispatch, lastMove.legalMoves, nextMoveTeam],
  );

  useEventListener('keydown', ({ key }) => {
    switch (key) {
      case 'ArrowLeft':
        dispatch(actions.game.selectedFen.set(previousMoveFen));
        break;
      case 'ArrowRight':
        dispatch(actions.game.selectedFen.set(nextMoveFen));
        break;
      default:
        break;
    }
  });

  return null;
};

export default GameInteraction;
