import { combineReducers } from 'redux';
// Home
import autoMove from 'scenes/Home/reducers/autoMove';
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
  if (gameSlug === null) getBlackPlayer({ players });
  return players.find(p => p.name !== username);
};

// TODO: add a state that allows players to flip their original orientation
export const getInitialUserOrientation = ({ players, username }) =>
  getUserColor({ players, username }) === Color.BLACK;

// TODO: move to layout class that displays board and players
export const getCurrentPlayer = ({ gameSlug, players, username }) => {
  if (gameSlug === null) getRedPlayer({ players });
  return getUserPlayer({ players, username });
};
