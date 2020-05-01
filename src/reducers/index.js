import { combineReducers } from 'redux';
import { Color } from 'services/logic/constants';
import { moveToSquares } from 'services/logic/square';

import keys from 'lodash/keys';

import { handleAction } from 'redux-actions';

// Home
import games from './games';
import loginForm from './loginForm';
// Game
import positions, * as fromPositions from './positions';
import players from './players';
// Board
import animationOffset, * as fromAnimationOffset from './animationOffset';

const basicReducer = (type, defaultState) =>
  handleAction(type, (state, action) => action.payload, defaultState);

const rootReducer = combineReducers({
  // Home,
  autoMove: handleAction('set_auto_move', (state, action) => action.colors, []),
  games,
  gameSlug: basicReducer('GAME/SLUG/SET', null),
  loginForm,
  showGame: handleAction(
    'toggle_show_game',
    (state, action) => action.showGame,
    false,
  ),
  username: handleAction(
    'set_username',
    (state, action) => action.username,
    null,
  ),
  // Game
  positions,
  players,
  showConfirmMoveMenu: basicReducer('GAME/SHOW_CONFIRM_MOVE_MENU/SET', false),
  requestedTakeback: handleAction(
    'set_requested_takeback',
    (state, action) => action.requestedTakeback,
    false,
  ),
  // TODO: rename to selectedPositionId
  selectedMoveId: basicReducer('GAME/SELECTED_POSITION/SET', null),
  updateCount: handleAction(
    'set_update_count',
    (state, action) => action.updateCount,
    -1,
  ),
  // Board
  animationOffset,
  canMoveBothColors: handleAction(
    'toggle_can_move_both_colors',
    (state, action) => action.canMoveBothColors,
    false,
  ),
  selectedSquare: basicReducer('BOARD/SELECTED_SQUARE/SET', null),
});

export default rootReducer;

/***************/
/***  Moves  ***/
/***************/

export const getHasInitialPlacement = ({ positions }) =>
  fromPositions.getHasInitialPlacement(positions);

export const getMoveCount = ({ positions }) =>
  fromPositions.getMoveCount(positions);

export const getLastMove = ({ positions }) =>
  fromPositions.getLastMove(positions);

export const getIsLastMovePending = ({ positions }) =>
  fromPositions.getIsLastMovePending(positions);

export const getSelectedMove = ({ positions, selectedMoveId }) => {
  const result = fromPositions.getMoveById(positions, selectedMoveId);
  if (result !== undefined) return result;

  return getLastMove({ positions });
};

export const getPreviousMove = state =>
  fromPositions.getPreviousMove(state.positions, getSelectedMove(state).id);

export const getNextMove = state =>
  fromPositions.getNextMove(state.positions, getSelectedMove(state).id);

export const getNextMoveColor = ({ positions }) =>
  fromPositions.getNextMoveColor(positions);

export const getFirstMoveWithMissingData = ({ positions }) =>
  fromPositions.getFirstMoveWithMissingData(positions);

/*****************/
/***  Players  ***/
/*****************/

const lookupPlayer = (players, key, value) =>
  players.find(p => p[key] === value);

export const getNextMovePlayer = ({ players, positions }) =>
  lookupPlayer(players, 'color', getNextMoveColor({ positions }));

export const getNextMovePlayerName = ({ players, positions }) => {
  try {
    return getNextMovePlayer({ players, positions }).name;
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

  // TODO: for now we can assume that legal positions are only allowed for the
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
  // TODO: this is undefined while legal positions are still being fetched
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
