import update from 'immutability-helper';
import findIndex from 'lodash/findIndex';
import sortedIndexBy from 'lodash/sortedIndexBy';

import XiangqiBoard from 'services/logic';
import { Color } from 'services/logic/constants';
import { getMovedPiece, getMovingPiece } from 'services/logic/move';

const getMoveIndex = (state, moveId) => {
  const moveIndex = sortedIndexBy(state, { id: moveId }, 'id');
  if (state[moveIndex].id === moveId) return moveIndex;
  return -1;
};

const nextBoardAndPiece = (state, action) => {
  if (action.fen !== undefined) {
    const board = new XiangqiBoard({ fen: action.fen });
    return {
      board,
      piece:
        action.move === null
          ? null
          : getMovedPiece(board.placement, action.move),
    };
  }

  const { board } = state[state.length - 1];
  return {
    board: board.move(action.move),
    piece: getMovingPiece(board.placement, action.move),
  };
};

const addMove = (state, action) => {
  const move = {
    id: action.moveId,
    givesCheck: action.givesCheck,
    fen: action.fen,
    legalMoves: action.legalMoves,
    move: action.move,
    pending: action.pending,
    ...nextBoardAndPiece(state, action),
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
        ...nextBoardAndPiece(state, action),
      },
    },
  });
};

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
  if (state[0].board === undefined) return false;

  return true;
};

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
  if (!getHasInitialPlacement(state)) {
    return Color.RED;
  }

  const { board } = getLastMove(state);
  return board.activeColor;
};

export const getMissingLegalMovesPayload = state => {
  const index = findIndex(state, move => move.legalMoves === undefined);
  if (index === -1) return;

  return { fen: state[index - 1].fen, move: state[index] };
};
