import { useCallback, useEffect } from 'react';
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

const FETCH_GAME_ON_MESSAGE_TYPES_OPPONENT = [
  'move',
  'offered_draw',
  'rejected_draw',
  'accepted_draw',
  'canceled_draw',
  'offered_takeback',
  'rejected_takeback',
  'canceled_takeback',
  'resigned',
];

const FETCH_GAME_ON_MESSAGE_TYPES_BOTH_PLAYERS = ['accepted_takeback'];

const FETCH_GAME_ON_MESSAGE_TYPES = [].concat(
  FETCH_GAME_ON_MESSAGE_TYPES_OPPONENT,
  FETCH_GAME_ON_MESSAGE_TYPES_BOTH_PLAYERS,
);

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

  const needToFetchGame = useCallback(() => {
    if (!lastMessage) return false;
    const { type, payload } = lastMessage;

    if (!FETCH_GAME_ON_MESSAGE_TYPES.includes(type)) return false;
    if (payload.gameSlug !== gameSlug) return false;
    if (FETCH_GAME_ON_MESSAGE_TYPES_BOTH_PLAYERS.includes(type)) {
      return true;
    }

    return payload.username !== username;
  }, [gameSlug, lastMessage, username]);

  useEffect(() => {
    if (!needToFetchGame) return;

    dispatch(fetchGame({ gameSlug }));
  }, [dispatch, gameSlug, needToFetchGame]);

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
