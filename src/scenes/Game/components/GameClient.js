import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import isEqual from 'lodash/isEqual';

import fetchStartingPosition from 'actions/fetchStartingPosition';
import fetchPosition from 'actions/fetchPosition';
import pollMoves from 'actions/pollMoves';
import {
  getHasInitialPlacement,
  getNextMovePlayerName,
  getFirstMoveWithMissingData,
  getMoveCount,
} from 'reducers';

const POLLING_INTERVAL = 2500;

const GameClient = () => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
  const hasInitialPlacement = useSelector(state =>
    getHasInitialPlacement(state),
  );
  const moveCount = useSelector(state => getMoveCount(state));
  const nextMovePlayerName = useSelector(state => getNextMovePlayerName(state));
  const firstMoveWithMissingData = useSelector(
    state => getFirstMoveWithMissingData(state),
    isEqual,
  );
  const updateCount = useSelector(state => state.updateCount);
  const username = useSelector(state => state.username);

  useEffect(() => {
    if (gameSlug) return;
    if (hasInitialPlacement) return;

    dispatch(fetchStartingPosition());
  }, [dispatch, gameSlug, hasInitialPlacement]);

  useEffect(
    () => {
      if (gameSlug) return;
      if (!hasInitialPlacement) return;
      if (!firstMoveWithMissingData) return;

      dispatch(fetchPosition(firstMoveWithMissingData));
    },
    // HACK: too many updates because missing legal moves is an object and
    // useEffect is doing a deep comparison. To get around this, we exclude it
    // from the comparison and key on the move count.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, hasInitialPlacement, moveCount],
  );

  useEffect(
    () => {
      const interval = setInterval(() => {
        dispatch(
          pollMoves({ gameSlug, nextMovePlayerName, updateCount, username }),
        );
      }, POLLING_INTERVAL);
      return () => clearInterval(interval);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, nextMovePlayerName],
  );

  return null;
};

export default GameClient;
