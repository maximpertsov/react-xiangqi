import update from 'immutability-helper';
import sortedIndexBy from 'lodash/sortedIndexBy';

import XiangqiBoard from 'services/logic';
import { Color } from 'services/logic/constants';
import { isRed } from 'services/logic/utils';
import { getMovedPiece, getMovingPiece } from 'services/logic/move';

const getMoveIndex = (state, moveId) => {
  const moveIndex = sortedIndexBy(state, { id: moveId }, 'id');
  if (state[moveIndex].id === moveId) return moveIndex;
  return -1;
};

/* eslint-disable-next-line max-len */
export const DEFAULT_FEN =
  'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';

const initialMoves = [
  {
    id: 0,
    move: null,
    piece: undefined,
    board: new XiangqiBoard({ fen: DEFAULT_FEN }),
    pending: false,
  },
];

const serverMove = (state, { fen, givesCheck, legalMoves, move }) => {
  const board = new XiangqiBoard({ fen });
  return {
    board,
    fen,
    givesCheck,
    legalMoves,
    // TODO: ugly, don't use board internals
    piece: getMovedPiece(board.placement, move),
  };
};

const localMove = (state, { move }) => {
  const { board } = state[state.length - 1];
  return {
    board: board.move(move),
    // TODO: ugly, don't use board internals
    piece: getMovingPiece(board.placement, move),
  };
};

const addMove = (state, action) => {
  const move = {
    id: action.moveId,
    move: action.move,
    pending: action.pending,
    ...(action.fen === undefined
      ? localMove(state, action)
      : serverMove(state, action)),
  };
  return update(state, { $push: [move] });
};

const cancelMoves = state => {
  const confirmedMoves = state.filter(({ pending }) => !pending);

  return confirmedMoves;
};

const confirmMoves = state => state.map(move => ({ ...move, pending: false }));

const setMove = (state, action) => {
  const moveIndex = getMoveIndex(state, action.moveId);

  return update(state, { [moveIndex]: { $set: action.move } });
};

const moves = (state = initialMoves, action) => {
  switch (action.type) {
    case 'add_move':
      return addMove(state, action);
    case 'cancel_moves':
      return cancelMoves(state);
    case 'confirm_moves':
      return confirmMoves(state);
    case 'set_move':
      return setMove(state);
    default:
      return state;
  }
};

export default moves;

/*******************/
/***  Selectors  ***/
/*******************/

export const getMoveCount = state => state.length - 1;

export const getLastMove = state => state[getMoveCount(state)];

export const getMoveById = (state, moveId) => {
  const moveIndex = getMoveIndex(state, moveId);
  return state[moveIndex];
};

export const getPreviousMove = (state, moveId) => {
  const moveIndex = getMoveIndex(state, moveId);
  return state[Math.max(moveIndex - 1, 0)];
};

export const getNextMove = (state, moveId) => {
  const moveCount = getMoveCount(state);
  const moveIndex = getMoveIndex(state, moveId);
  return state[Math.min(moveIndex + 1, moveCount)];
};

export const getNextMoveColor = state => {
  if (getMoveCount(state) === 0) return Color.RED;

  const { piece } = getLastMove(state);
  return isRed(piece) ? Color.BLACK : Color.RED;
};
