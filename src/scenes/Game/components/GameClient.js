import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import fetchGame from 'actions/fetchGame';
import fetchPosition from 'actions/fetchPosition';
import fetchStartingPosition from 'actions/fetchStartingPosition';
import {
  getFirstFenWithoutLegalMoves,
  getHasInitialPlacement,
  getLastMessage,
} from 'reducers/selectors';

const mapStateToProps = createSelector(
  [state => state],

  state => ({
    gameSlug: state.gameSlug,
    hasInitialPlacement: getHasInitialPlacement(state),
    firstFenWithoutLegalMoves: getFirstFenWithoutLegalMoves(state),
    lastMessage: getLastMessage(state),
    username: state.username,
  }),
);

const FETCH_GAME_ON_MESSAGE_TYPES = [
  'move',
  'offered_draw',
  'rejected_draw',
  'accepted_draw',
  'canceled_draw',
  'offered_takeback',
  'rejected_takeback',
  'accepted_takeback',
  'canceled_takeback',
];

const GameClient = () => {
  const dispatch = useDispatch();

  const {
    gameSlug,
    hasInitialPlacement,
    firstFenWithoutLegalMoves,
    lastMessage,
    username,
  } = useSelector(mapStateToProps, isEqual);

  useEffect(() => {
    if (!gameSlug) return;

    dispatch(fetchGame({ gameSlug }));
  }, [dispatch, gameSlug]);

  useEffect(() => {
    if (!lastMessage) return;
    if (!FETCH_GAME_ON_MESSAGE_TYPES.includes(lastMessage.type)) return;
    if (lastMessage.payload.gameSlug !== gameSlug) return;
    if (lastMessage.payload.username === username) return;

    dispatch(fetchGame({ gameSlug }));
  }, [dispatch, gameSlug, lastMessage, username]);

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
