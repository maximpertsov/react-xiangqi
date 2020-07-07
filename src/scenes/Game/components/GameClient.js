import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import isEqual from 'lodash/isEqual';
import last from 'lodash/last';

import fetchGame from 'actions/fetchGame';
import fetchStartingPosition from 'actions/fetchStartingPosition';
import fetchPosition from 'actions/fetchPosition';
import pollMoves from 'actions/pollMoves';
import { getHasInitialPlacement, getFirstFenWithoutLegalMoves } from 'reducers';

const POLLING_INTERVAL = 2500;

const GameClient = () => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
  const hasInitialPlacement = useSelector(state =>
    getHasInitialPlacement(state),
  );
  const firstFenWithoutLegalMoves = useSelector(
    state => getFirstFenWithoutLegalMoves(state),
    isEqual,
  );
  const messages = useSelector(state => state.messages, isEqual);
  const updateCount = useSelector(state => state.updateCount);
  const username = useSelector(state => state.username);

  useEffect(() => {
    dispatch(fetchGame({ gameSlug }));
  }, [dispatch, gameSlug]);

  useEffect(() => {
    const lastMessage = last(messages);

    if (!lastMessage) return;
    if (lastMessage.type !== 'move') return;
    if (gameSlug !== lastMessage.gameSlug) return;
    if (username === lastMessage.username) return;

    dispatch(fetchGame({ gameSlug }));
  }, [dispatch, gameSlug, messages, username]);

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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     dispatch(
  //       pollMoves({
  //         gameSlug,
  //         updateCount,
  //         username,
  //       }),
  //     );
  //   }, POLLING_INTERVAL);
  //   return () => clearInterval(interval);
  // }, [dispatch, gameSlug, updateCount, username]);

  return null;
};

export default GameClient;
