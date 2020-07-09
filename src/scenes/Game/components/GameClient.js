import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import isEqual from 'lodash/isEqual';
import last from 'lodash/last';

import fetchGame from 'actions/fetchGame';
import fetchStartingPosition from 'actions/fetchStartingPosition';
import fetchPosition from 'actions/fetchPosition';
import { getHasInitialPlacement, getFirstFenWithoutLegalMoves } from 'reducers';

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
  const username = useSelector(state => state.username);

  useEffect(() => {
    if (!gameSlug) return;

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

  return null;
};

export default GameClient;
