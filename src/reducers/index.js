import actions from 'actions';
import { combineReducers } from 'redux';
import { Color } from 'services/logic/constants';
import { uciToSquares } from 'services/logic/square';

import keys from 'lodash/keys';

import { handleAction, combineActions } from 'redux-actions';

// Home
import loginForm from './loginForm';
// Game
import moves, * as fromMoves from './moves';
import players from './players';
// Board
import * as fromAnimationOffset from './animationOffset';

const rootReducer = combineReducers({
  // Home,
  autoMove: handleAction(
    combineActions(
      actions.home.autoMove.set.off,
      actions.home.autoMove.set.red,
      actions.home.autoMove.set.black,
      actions.home.autoMove.set.both,
    ),
    (state, action) => action.payload,
    [],
  ),
  games: handleAction(
    actions.home.games.set,
    (state, action) => action.payload,
    [],
  ),
  gameSlug: handleAction(
    actions.game.slug.set,
    (state, action) => action.payload,
    null,
  ),
  loginForm,
  showGame: handleAction(
    actions.home.showGame.set,
    (state, action) => action.payload,
    false,
  ),
  username: handleAction(
    actions.home.username.set,
    (state, action) => action.payload,
    null,
  ),
  // Game
  moves,
  players,
  showConfirmMoveMenu: handleAction(
    actions.game.showConfirmMoveMenu.set,
    (state, action) => action.payload,
    false,
  ),
  requestedTakeback: handleAction(
    actions.game.requestedTakeback.set,
    (state, action) => action.payload,
    false,
  ),
  selectedFen: handleAction(
    actions.game.selectedFen.set,
    (state, action) => action.payload,
    null,
  ),
  updateCount: handleAction(
    actions.game.updateCount.set,
    (state, action) => action.payload,
    -1,
  ),
  // Board
  animationOffset: handleAction(
    combineActions(
      actions.board.animationOffset.set,
      actions.board.animationOffset.clear,
    ),
    (state, action) => action.payload,
    [0, 0],
  ),
  canMoveBothColors: handleAction(
    actions.game.canMoveBothColors.set,
    (state, action) => action.payload,
    false,
  ),
  selectedSquare: handleAction(
    actions.board.selectedSquare.set,
    (state, action) => action.payload,
    null,
  ),
});

export default rootReducer;

/***************/
/***  Moves  ***/
/***************/

export const getHasInitialPlacement = ({ moves }) =>
  fromMoves.getHasInitialPlacement(moves);

export const getMoveCount = ({ moves }) => fromMoves.getMoveCount(moves);

export const getLastMove = ({ moves }) => fromMoves.getLastMove(moves);

export const getSelectedMove = ({ moves, selectedFen }) => {
  const result = fromMoves.getMoveByFen(moves, selectedFen);
  if (result !== undefined) return result;

  return getLastMove({ moves });
};

export const getPreviousMove = state =>
  fromMoves.getPreviousMove(state.moves, getSelectedMove(state).fen);

export const getNextMove = state =>
  fromMoves.getNextMove(state.moves, getSelectedMove(state).fen);

export const getNextMoveColor = ({ moves }) =>
  fromMoves.getNextMoveColor(moves);

export const getFirstMoveWithMissingData = ({ moves }) =>
  fromMoves.getFirstMoveWithMissingData(moves);

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
  const { fen: lastMoveFen, legalMoves } = getLastMove(state);

  // TODO: for now we can assume that legal moves are only allowed for the
  // latest move. However, this will change if we ever implement an analysis
  // board-style function.
  if (lastMoveFen !== getSelectedMove(state).fen) return [];
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
    uci => uciToSquares(uci)[0] === state.selectedSquare,
  );
};

/********************/
/***  Animations  ***/
/********************/
export const getIsMoving = ({ animationOffset }) =>
  fromAnimationOffset.getIsMoving(animationOffset);
