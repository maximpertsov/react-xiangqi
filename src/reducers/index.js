import { combineReducers } from 'redux';
import { Color } from 'services/logic/constants';
import { moveToSquares } from 'services/logic/square';

import keys from 'lodash/keys';

// Home
import autoMove from './autoMove';
import games from './games';
import gameSlug from './gameSlug';
import loginForm from './loginForm';
import showGame from './showGame';
import username from './username';
// Game
import positions, * as fromPositions from './positions';
import players from './players';
import requestedTakeback from './requestedTakeback';
import selectedMoveId from './selectedMoveId';
import updateCount from './updateCount';
// Board
import animationOffset, * as fromAnimationOffset from './animationOffset';
import canMoveBothColors from './canMoveBothColors';
import selectedSquare from './selectedSquare';

const rootReducer = combineReducers({
  // Home,
  autoMove,
  games,
  gameSlug,
  loginForm,
  showGame,
  username,
  // Game
  positions,
  players,
  requestedTakeback,
  selectedMoveId,
  updateCount,
  // Board
  animationOffset,
  canMoveBothColors,
  selectedSquare,
});

export default rootReducer;

/***************/
/***  Moves  ***/
/***************/

export const getHasInitialPlacement = ({ moves }) =>
  fromPositions.getHasInitialPlacement(moves);

export const getMoveCount = ({ moves }) => fromPositions.getMoveCount(moves);

export const getLastMove = ({ moves }) => fromPositions.getLastMove(moves);

export const getIsLastMovePending = ({ moves }) =>
  fromPositions.getIsLastMovePending(moves);

export const getSelectedMove = ({ moves, selectedMoveId }) => {
  const result = fromPositions.getMoveById(moves, selectedMoveId);
  if (result !== undefined) return result;

  return getLastMove({ moves });
};

export const getPreviousMove = state =>
  fromPositions.getPreviousMove(state.moves, getSelectedMove(state).id);

export const getNextMove = state =>
  fromPositions.getNextMove(state.moves, getSelectedMove(state).id);

export const getNextMoveColor = ({ moves }) =>
  fromPositions.getNextMoveColor(moves);

export const getFirstMoveWithMissingData = ({ moves }) =>
  fromPositions.getFirstMoveWithMissingData(moves);

/*****************/
/***  Players  ***/
/*****************/

const lookupPlayer = (players, key, value) =>
  players.find(p => p[key] === value);

export const getNextMovePlayer = ({ players, moves }) =>
  lookupPlayer(players, 'color', getNextMoveColor({ moves }));

export const getNextMovePlayerName = ({ players, moves }) => {
  try {
    return getNextMovePlayer({ players, moves }).name;
  } catch (e) {
    if (e instanceof TypeError) return undefined;
    throw e;
  }
};

const getUserPlayer = ({ players, username }) =>
  lookupPlayer(players, 'name', username);

export const getRedPlayer = ({ players }) =>
  lookupPlayer(players, 'color', Color.RED);

export const getBlackPlayer = ({ players }) =>
  lookupPlayer(players, 'color', Color.BLACK);

export const getUserColor = ({ players, username }) => {
  try {
    return getUserPlayer({ players, username }).color;
  } catch (e) {
    if (e instanceof TypeError) return undefined;
    throw e;
  }
};

export const getOtherPlayer = ({ gameSlug, players, username }) => {
  if (gameSlug === null) return getBlackPlayer({ players });
  return players.find(p => p.name !== username);
};

export const getBottomPlayerIsRed = (
  { reversed, players, username } = { reversed: false },
) => {
  // TODO: add a state that allows players to flip their original orientation
  const userColor = getUserColor({ players, username });
  const init =
    userColor === undefined ||
    getUserColor({ players, username }) === Color.RED;
  return reversed ? !init : init;
};

// TODO: move to layout class that displays board and players
export const getCurrentPlayer = ({ gameSlug, players, username }) => {
  if (gameSlug === null) return getRedPlayer({ players });
  return getUserPlayer({ players, username });
};

export const getCurrentPlayerColor = state => {
  try {
    return getCurrentPlayer(state).color;
  } catch (e) {
    if (e instanceof TypeError) return undefined;
    throw e;
  }
};

/********************/
/***  Game Logic  ***/
/********************/

export const getLegalMoves = state => {
  const currentPlayerColor = getCurrentPlayerColor(state);
  const nextMoveColor = getNextMoveColor(state);
  const { id: lastMoveId, legalMoves } = getLastMove(state);

  // TODO: for now we can assume that legal moves are only allowed for the
  // latest move. However, this will change if we ever implement an analysis
  // board-style function.
  if (lastMoveId !== getSelectedMove(state).id) return [];
  if (!state.canMoveBothColors && currentPlayerColor !== nextMoveColor) {
    return [];
  }
  return legalMoves;
};

export const getTargets = state => {
  if (state.selectedSquare === null) return [];

  const legalMoves = getLegalMoves(state);
  // TODO: this is undefined while legal moves are still being fetched
  if (legalMoves === undefined) return [];

  return keys(legalMoves).filter(
    move => moveToSquares(move)[0] === state.selectedSquare,
  );
};

/********************/
/***  Animations  ***/
/********************/
export const getIsMoving = ({ animationOffset }) =>
  fromAnimationOffset.getIsMoving(animationOffset);
