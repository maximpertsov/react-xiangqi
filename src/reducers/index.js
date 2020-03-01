import { combineReducers } from 'redux';
// Home
import autoMove from 'scenes/Home/reducers/autoMove';
import games from 'scenes/Home/reducers/games';
import gameSlug from 'scenes/Home/reducers/gameSlug';
import loginForm from 'scenes/Home/reducers/loginForm';
import showGame from 'scenes/Home/reducers/showGame';
import username from 'scenes/Home/reducers/username';
// Game
import loading from 'scenes/Game/reducers/loading';
import moves, * as fromMoves from './moves';
import players from 'scenes/Game/reducers/players';
import selectedMoveId from 'scenes/Game/reducers/selectedMoveId';
// Board
/* eslint-disable-next-line max-len */
import animationOffset, * as fromAnimationOffset from 'components/Board/reducers/animationOffset';
import canMoveBothColors from 'components/Board/reducers/canMoveBothColors';
import selectedSlot from 'components/Board/reducers/selectedSlot';

import { Color } from 'services/logic/constants';
import { encode } from 'services/logic/square';

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

export const getNextMoveColor = ({ moves }) =>
  fromMoves.getNextMoveColor(moves);

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
  if (state.selectedSlot === null) return [];

  const fromSquare = encode(state.selectedSlot);
  return getLegalMoves(state).filter(move => move.startsWith(fromSquare));
};

export const getHasLegalMoves = state => {
  const { board } = getLastMove(state);
  return board.hasLegalMoves(getNextMoveColor(state));
};

/********************/
/***  Animations  ***/
/********************/
export const getIsMoving = ({ animationOffset }) =>
  fromAnimationOffset.getIsMoving(animationOffset);
