import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import isEqual from 'lodash/isEqual';

import fetchStartingPosition from 'actions/fetchStartingPosition';
import fetchPosition from 'actions/fetchPosition';
import pollMoves from 'actions/pollMoves';
import {
  getHasInitialPlacement,
  getNextMovePlayerName,
  getFirstFenWithoutLegalMoves,
} from 'reducers';

const POLLING_INTERVAL = 2500;

const GameClient = () => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
  const hasInitialPlacement = useSelector(state =>
    getHasInitialPlacement(state),
  );
  const nextMovePlayerName = useSelector(state => getNextMovePlayerName(state));
  const firstFenWithoutLegalMoves = useSelector(
    state => getFirstFenWithoutLegalMoves(state),
    isEqual,
  );
  const updateCount = useSelector(state => state.updateCount);
  const username = useSelector(state => state.username);

  useEffect(() => {
    if (gameSlug) return;
    if (hasInitialPlacement) return;

    dispatch(fetchStartingPosition());
  }, [dispatch, gameSlug, hasInitialPlacement]);

  useEffect(() => {
    if (gameSlug) return;
    if (!hasInitialPlacement) return;
    if (!firstFenWithoutLegalMoves) return;

    dispatch(fetchPosition({ fen: firstFenWithoutLegalMoves }));
  }, [dispatch, firstFenWithoutLegalMoves, gameSlug, hasInitialPlacement]);

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
