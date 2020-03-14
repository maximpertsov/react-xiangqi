import { combineReducers } from 'redux';
import { Color } from 'services/logic/constants';
import { moveToSquares } from 'services/logic/square';

// Home
import autoMove from './autoMove';
import games from './games';
import gameSlug from './gameSlug';
import loginForm from './loginForm';
import showGame from './showGame';
import username from './username';
// Game
import loading from './loading';
import moves, * as fromMoves from './moves';
import players from './players';
import selectedMoveId from './selectedMoveId';
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
  loading,
  moves,
  players,
  selectedMoveId,
  // Board
  animationOffset,
  canMoveBothColors,
  selectedSquare,
});

export default rootReducer;

/***************/
/***  Moves  ***/
/***************/

export const getMoveCount = ({ moves }) => fromMoves.getMoveCount(moves);

export const getLastMove = ({ moves }) => fromMoves.getLastMove(moves);

export const getSelectedMove = ({ moves, selectedMoveId }) =>
  fromMoves.getMoveById(moves, selectedMoveId);

export const getPreviousMove = ({ moves, selectedMoveId }) =>
  fromMoves.getPreviousMove(moves, selectedMoveId);

export const getNextMove = ({ moves, selectedMoveId }) =>
  fromMoves.getNextMove(moves, selectedMoveId);

export const getNextMoveColor = ({ moves }) =>
  fromMoves.getNextMoveColor(moves);

export const getMissingLegalMovesPayload = ({ moves }) =>
  fromMoves.getMissingLegalMovesPayload(moves);

/*****************/
/***  Players  ***/
/*****************/

const lookupPlayer = (players, key, value) =>
  players.find(p => p[key] === value);

export const getNextMovePlayer = ({ players, moves }) =>
  lookupPlayer(players, 'color', getNextMoveColor({ moves }));

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
  if (lastMoveId !== state.selectedMoveId) return [];
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

  return legalMoves.filter(
    move => moveToSquares(move)[0] === state.selectedSquare,
  );
};

export const getHasLegalMoves = state => {
  const { legalMoves } = getLastMove(state);
  return legalMoves && legalMoves.length > 0;
};

/********************/
/***  Animations  ***/
/********************/
export const getIsMoving = ({ animationOffset }) =>
  fromAnimationOffset.getIsMoving(animationOffset);
