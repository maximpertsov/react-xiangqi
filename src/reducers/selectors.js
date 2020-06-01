import { Color } from 'services/logic/constants';
import { uciToSquares } from 'services/logic/square';
import { moveOrder } from 'services/logic/fen';

import find from 'lodash/fp/find';
import flow from 'lodash/fp/flow';
import get from 'lodash/fp/get';

import keys from 'lodash/keys';

// Game
import * as fromMoves from './moves';
// Board
import * as fromAnimationOffset from './animationOffset';

/***************/
/***  Moves  ***/
/***************/

export const getHasInitialPlacement = ({ moves }) =>
  fromMoves.getHasInitialPlacement(moves);

export const getLastMove = ({ moves }) => fromMoves.getLastMove(moves);

export const getSelectedMove = ({ moves, currentMoveFen, selectedFen }) =>
  find(['fen', selectedFen], moves) ||
  find(['fen', currentMoveFen], moves) ||
  getLastMove({ moves });

export const getPreviousMoveFen = state => {
  const { fen } = getSelectedMove(state);
  const order = moveOrder(fen);
  const result = flow(
    find(move => moveOrder(move.fen) === order - 1),
    get('fen'),
  )(state.moves);

  return result || fen;
};

export const getNextMoveFen = state => {
  const { fen } = getSelectedMove(state);
  const order = moveOrder(fen);
  const result = flow(
    find(move => moveOrder(move.fen) === order + 1),
    get('fen'),
  )(state.moves);

  return result || fen;
};

export const getNextMoveColor = ({ moves }) =>
  fromMoves.getNextMoveColor(moves);

export const getFirstFenWithoutLegalMoves = ({ moves }) =>
  fromMoves.getFirstFenWithoutLegalMoves(moves);

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

export default {};
