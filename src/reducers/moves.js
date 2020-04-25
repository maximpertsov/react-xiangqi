import update from 'immutability-helper';
import findIndex from 'lodash/findIndex';
import sortedIndexBy from 'lodash/sortedIndexBy';
import { decode as decodeFen } from 'services/logic/fen';

import { Color } from 'services/logic/constants';

const getMoveIndex = (state, moveId) => {
  const moveIndex = sortedIndexBy(state, { id: moveId }, 'id');
  if (state[moveIndex] && state[moveIndex].id === moveId) return moveIndex;
  return -1;
};

const addMove = (state, action) => {
  const move = {
    id: state.length,
    givesCheck: action.givesCheck,
    fen: action.fen,
    legalMoves: action.legalMoves,
    move: action.move,
    pending: action.pending,
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

  return update(state, {
    [moveIndex]: {
      $set: {
        id: action.moveId,
        givesCheck: action.givesCheck,
        fen: action.fen,
        legalMoves: action.legalMoves,
        move: action.move,
        pending: action.pending,
      },
    },
  });
};

const setMoves = (state, action) => {
  return action.moves.map((move, index) => ({ ...move, id: index }));
};

// eslint-disable-next-line complexity
const moves = (state = [], action) => {
  switch (action.type) {
    case 'add_move':
      return addMove(state, action);
    case 'cancel_moves':
      return cancelMoves(state);
    case 'confirm_moves':
      return confirmMoves(state);
    case 'set_move':
      return setMove(state, action);
    case 'set_moves':
      return setMoves(state, action);
    default:
      return state;
  }
};

export default moves;

/*******************/
/***  Selectors  ***/
/*******************/

export const getHasInitialPlacement = state => {
  if (state.length === 0) return false;
  if (state[0].fen === undefined) return false;

  return true;
};

export const getMoveCount = state => state.length - 1;

export const getLastMove = state => state[getMoveCount(state)];

export const getIsLastMovePending = state =>
  getHasInitialPlacement(state) && getLastMove(state).pending;

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
  if (!getHasInitialPlacement(state)) {
    return Color.RED;
  }

  const { fen } = getLastMove(state);
  return decodeFen(fen).activeColor;
};

export const getFirstMoveWithMissingData = state => {
  const index = findIndex(state, move => move.legalMoves === undefined);
  if (index === -1) return;

  return state[index];
};
