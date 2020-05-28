import update from 'immutability-helper';

import find from 'lodash/fp/find';
import findIndex from 'lodash/fp/findIndex';
import flow from 'lodash/fp/flow';
import fromPairs from 'lodash/fp/fromPairs';
import last from 'lodash/fp/last';
import pick from 'lodash/fp/pick';
import reject from 'lodash/fp/reject';
import sortBy from 'lodash/fp/sortBy';

import { decodeFen, moveOrder } from 'services/logic/fen';

import { Color } from 'services/logic/constants';

const moveFields = ['fen', 'gameResult', 'givesCheck', 'legalMoves', 'uci'];

const createMove = properties => ({
  ...fromPairs(moveFields.map(field => [field, undefined])),
  ...pick(moveFields, properties),
});

const addMove = (state, payload) => {
  // TODO: duplicate FEN?
  return update(state, {
    $push: [createMove({ ...payload })],
  });
};

const removeMove = (state, fen) => reject(['fen', fen], state);

const updateMove = (state, payload) =>
  state.map(move => {
    if (payload.fen === move.fen) {
      return createMove({ ...move, ...payload });
    }
    return move;
  });

const setMoves = (state, moves) => moves.map(createMove);

// eslint-disable-next-line complexity
const moves = (state = [], action) => {
  switch (action.type) {
    case 'GAME/MOVES/ADD':
      return addMove(state, action.payload);
    case 'GAME/MOVES/REMOVE':
      return removeMove(state, action.payload);
    case 'GAME/MOVES/UPDATE':
      return updateMove(state, action.payload);
    case 'GAME/MOVES/SET':
      return setMoves(state, action.payload);
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

export const getLastMove = state =>
  flow(
    sortBy(({ fen }) => moveOrder(fen)),
    last,
  )(state);

// TODO: consider putting moves in an object to speed up this lookup
export const getMoveByFen = (state, fen) => find(['fen', fen], state);

export const getPreviousMove = (state, fen) => {
  const order = moveOrder(fen);
  const result = find(({ fen }) => moveOrder(fen) === order - 1, state);

  return result || getMoveByFen(fen);
};

export const getNextMove = (state, fen) => {
  const order = moveOrder(fen);
  const result = find(({ fen }) => moveOrder(fen) === order + 1, state);

  return result || getMoveByFen(fen);
};

export const getNextMoveColor = state => {
  if (!getHasInitialPlacement(state)) {
    return Color.RED;
  }

  const { fen } = getLastMove(state);
  return decodeFen(fen).activeColor;
};

// TODO: use find instead
export const getFirstMoveWithMissingData = state => {
  const index = findIndex(move => move.legalMoves === undefined, state);
  if (index === -1) return;

  return state[index];
};
