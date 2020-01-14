import update from 'immutability-helper';
import sortedIndexBy from 'lodash/sortedIndexBy';

import XiangqiBoard, * as logic from 'services/logic';
import { Color } from 'services/logic/constants';
import { isRed } from 'services/logic/utils';

/* eslint-disable-next-line max-len */
const DEFAULT_FEN = 'rheakaehr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR';

const initialMoves = [{
  id: 0,
  piece: undefined,
  fromPos: undefined,
  toPos: undefined,
  board: new XiangqiBoard({ fen: DEFAULT_FEN }),
  pending: false,
}];

const addMove = (state, { moveId, board, fromSlot, toSlot, pending }) => {
  const move = {
    id: moveId,
    fromPos: logic.getRankFile(fromSlot),
    toPos: logic.getRankFile(toSlot),
    piece: board.getPiece(fromSlot),
    board: board.move(fromSlot, toSlot),
    pending,
  };
  return update(state, { $push: [move] });
};

const cancelMoves = (state) => {
  const confirmedMoves = state.filter(({ pending }) => !pending);

  return confirmedMoves;
};

const confirmMoves = (state) => {
  return state.map((move) => ({ ...move, pending: false }));
};

// const setMove = (state, { origin: fromPos, destination: toPos }) => {
//   // TODO: get last move selector?
//   const { board } = state[state.length - 1];
//   const move = newMove({
//     piece: board.getPiece(fromPos, logic.RefType.RANK_FILE),
//     fromPos,
//     toPos,
//     board: board.move(fromPos, toPos, logic.RefType.RANK_FILE),
//     pending: false,
//   });
//   return update(state, { $push: [move] });
// };

// TODO: remove this?
// TODO: bulk increment nextMoveId counter?
const setMoves = () => initialMoves;

const moves = (state = initialMoves, action) => {
  switch (action.type) {
  case 'add_move':
    return addMove(state, action);
  case 'cancel_moves':
    return cancelMoves(state);
  case 'confirm_moves':
    return confirmMoves(state);
  case 'set_moves':
    return setMoves(state, action.moves);
  default:
    return state;
  }
};

export default moves;

/*******************/
/***  Selectors  ***/
/*******************/

const getMoveIndex = (state, moveId) => {
  const moveIndex = sortedIndexBy(state, { id: moveId }, 'id');
  if (state[moveIndex].id === moveId) return moveIndex;
  return -1;
};

export const getMoveCount = (state) => state.length - 1;

export const getLastMove = (state) => state[getMoveCount(state)];

export const getMoveById = (state, moveId) => {
  const moveIndex = getMoveIndex(state, moveId);
  return state[moveIndex];
};

export const getPreviousMove = (state, moveId) => {
  const moveIndex = getMoveIndex(state, moveId);
  return state[Math.min(moveIndex - 1, 0)];
};

export const getNextMove = (state, moveId) => {
  const moveCount = getMoveCount(state);
  const moveIndex = getMoveIndex(state, moveId);
  return state[Math.max(moveIndex + 1, moveCount)];
};

export const getNextMoveColor = (state) => {
  if (getMoveCount(state) === 0) return Color.RED;

  const { piece } = getLastMove(state);
  return isRed(piece) ? Color.BLACK : Color.RED;
};
