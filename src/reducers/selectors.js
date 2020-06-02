import { Color } from 'services/logic/constants';
import { uciToSquares } from 'services/logic/square';
import { moveOrder } from 'services/logic/fen';

import find from 'lodash/fp/find';
import flow from 'lodash/fp/flow';
import get from 'lodash/fp/get';

import isEqual from 'lodash/isEqual';
import keys from 'lodash/keys';

import * as fromMoves from './moves';
import * as fromAnimationOffset from './animationOffset';

/***************/
/***  Moves  ***/
/***************/

export const getHasInitialPlacement = ({ moves }) =>
  fromMoves.getHasInitialPlacement(moves);

export const getLastMove = ({ moves }) => fromMoves.getLastMove(moves);

export const getSelectedMove = ({ moves, selectedFen }) =>
  find(['fen', selectedFen], moves) || {};

export const getPreviousMoveFen = state => {
  if (!state.selectedFen) return;

  const order = moveOrder(state.selectedFen);
  const result = flow(
    find(move => moveOrder(move.fen) === order - 1),
    get('fen'),
  )(state.moves);

  return result || state.selectedFen;
};

export const getNextMoveFen = state => {
  if (!state.selectedFen) return;

  const order = moveOrder(state.selectedFen);
  const result = flow(
    find(move => moveOrder(move.fen) === order + 1),
    get('fen'),
  )(state.moves);

  return result || state.selectedFen;
};

export const getNextMoveColor = ({ moves }) =>
  fromMoves.getNextMoveColor(moves);

export const getFirstFenWithoutLegalMoves = ({ moves }) =>
  fromMoves.getFirstFenWithoutLegalMoves(moves);

/*****************/
/***  Players  ***/
/*****************/

export const getNextMovePlayer = state => {
  switch (getNextMoveColor(state)) {
    case Color.RED:
      return state.redPlayer;
    case Color.BLACK:
      return state.blackPlayer;
    default:
      return {};
  }
};

export const getUserColor = state => {
  switch (state.username) {
    case get('name', state.redPlayer):
      return Color.RED;
    case get('name', state.blackPlayer):
      return Color.BLACK;
    default:
      return;
  }
};

export const getCurrentPlayer = state => {
  if (!state.username) {
    return state.redPlayer || {};
  }

  switch (getUserColor(state)) {
    case Color.RED:
      return state.redPlayer;
    case Color.BLACK:
      return state.blackPlayer;
    default:
      return {};
  }
};

export const getOpponent = state => {
  if (!state.username) {
    return state.blackPlayer || {};
  }

  switch (getUserColor(state)) {
    case Color.RED:
      return state.blackPlayer;
    case Color.BLACK:
      return state.redPlayer;
    default:
      return {};
  }
};

// TODO: add a state that allows players to flip their original orientation
export const getBottomPlayerIsRed = state => {
  return getUserColor(state) !== Color.BLACK;
};

/********************/
/***  Game Logic  ***/
/********************/

export const getLegalMoves = state => {
  const lastMove = getLastMove(state);
  if (lastMove.fen !== state.selectedFen) return [];
  if (state.canMoveBothColors) return lastMove.legalMoves;

  const nextMovePlayer = getNextMovePlayer(state);
  const currentPlayer = getCurrentPlayer(state);
  if (isEqual(nextMovePlayer, currentPlayer)) return lastMove.legalMoves;

  return [];
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
