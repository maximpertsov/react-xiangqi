import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import isEqual from 'lodash/isEqual';
import last from 'lodash/last';

import fetchGame from 'actions/fetchGame';
import fetchStartingPosition from 'actions/fetchStartingPosition';
import fetchPosition from 'actions/fetchPosition';
import { getHasInitialPlacement, getFirstFenWithoutLegalMoves } from 'reducers';

const mapStateToProps = createSelector(
  [state => state],

  state => ({
    gameSlug: state.gameSlug,
    hasInitialPlacement: getHasInitialPlacement(state),
    firstFenWithoutLegalMoves: getFirstFenWithoutLegalMoves(state),
    messages: state.messages,
    username: state.username,
  }),
);

const GameClient = () => {
  const dispatch = useDispatch();

  const {
    gameSlug,
    hasInitialPlacement,
    firstFenWithoutLegalMoves,
    messages,
    username,
  } = useSelector(mapStateToProps, isEqual);

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
