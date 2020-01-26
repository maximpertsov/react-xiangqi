import { combineReducers } from 'redux';
// Home
import autoMove from 'scenes/Home/reducers/autoMove';
import canMoveBothColors from 'scenes/Home/reducers/canMoveBothColors';
import games from 'scenes/Home/reducers/games';
import gameSlug from 'scenes/Home/reducers/gameSlug';
import showGame from 'scenes/Home/reducers/showGame';
import username from 'scenes/Home/reducers/username';
// Game
import loading from 'scenes/Game/reducers/loading';
import moves, * as fromMoves from 'scenes/Game/reducers/moves';
import players from 'scenes/Game/reducers/players';
import selectedMoveId from 'scenes/Game/reducers/selectedMoveId';
// Board
import selectedSlot from 'components/Board/reducers/selectedSlot';

import { Color } from 'services/logic/constants';

const rootReducer = combineReducers({
  // Home,
  autoMove,
  canMoveBothColors,
  games,
  gameSlug,
  showGame,
  username,
  // Game
  loading,
  moves,
  players,
  selectedMoveId,
  // Board
  selectedSlot,
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

export const getNextMoveColor = ({ moves, selectedMoveId }) =>
  fromMoves.getNextMoveColor(moves, selectedMoveId);

/*****************/
/***  Players  ***/
/*****************/

const lookupPlayer = (players, key, value) =>
  players.find(p => p[key] === value);

export const getNextMovePlayer = state =>
  lookupPlayer(state.players, 'color', getNextMoveColor(state));

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

// TODO break up function
export const getLegalMoves = state => {
  const { board } = getSelectedMove(state);
  const currentPlayerColor = getCurrentPlayerColor(state);
  const nextMoveColor = getNextMoveColor(state);
  const lastMove = getLastMove(state);

  // TODO: for now we can assume that legal moves are only allowed for the
  // latest move. However, this will change if we ever implement an analysis
  // board-style function.
  if (lastMove.id !== state.selectedMoveId) return board.noLegalMoves();
  if (!state.canMoveBothColors && currentPlayerColor !== nextMoveColor) {
    return board.noLegalMoves();
  }
  return board.legalMovesByColor(nextMoveColor);
};

export const getHasLegalMoves = state => {
  const { board } = getLastMove(state);
  return board.hasLegalMoves(getNextMoveColor(state));
};

/*********************/
/***  Board Logic  ***/
/*********************/

export const getTargets = state => {
  if (state.selectedSlot === null) return [];

  // TODO: assumes last move is active
  const legalMoves = getLegalMoves(state);
  return legalMoves[state.selectedSlot];
};
