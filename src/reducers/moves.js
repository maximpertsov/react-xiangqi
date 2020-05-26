import update from 'immutability-helper';

import findIndex from 'lodash/findIndex';
import fromPairs from 'lodash/fromPairs';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import last from 'lodash/last';
import reject from 'lodash/reject';
import find from 'lodash/find';

import { decodeFen, moveOrder } from 'services/logic/fen';

import { Color } from 'services/logic/constants';

const moveFields = [
  'id',
  'fen',
  'gameResult',
  'givesCheck',
  'legalMoves',
  'uci',
];

const createMove = properties => ({
  ...fromPairs(moveFields.map(field => [field, undefined])),
  ...pick(properties, moveFields),
});

const addMove = (state, payload) => {
  const nextId = isEmpty(state) ? 0 : last(state).id + 1;

  return update(state, {
    $push: [createMove({ ...payload, id: nextId })],
  });
};

const removeMove = (state, id) => reject(state, move => move.id === id);

const updateMove = (state, payload) =>
  state.map(move => {
    if (payload.id === move.id) {
      return createMove({ ...move, ...payload });
    }
    return move;
  });

const setMoves = (state, moves) => {
  return moves.map((move, index) => createMove({ ...move, id: index }));
};

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

export const getLastMove = state => state[getMoveCount(state)];

// TODO: consider putting moves in an object to speed up this lookup
export const getMoveByFen = (state, fen) => find(state, ['fen', fen]);

export const getPreviousMove = (state, fen) => {
  const order = moveOrder(fen);
  const result = find(state, ({ fen }) => moveOrder(fen) === order - 1);

  return result || getMoveByFen(fen);
};

export const getNextMove = (state, fen) => {
  const order = moveOrder(fen);
  const result = find(state, ({ fen }) => moveOrder(fen) === order + 1);

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
  const index = findIndex(state, move => move.legalMoves === undefined);
  if (index === -1) return;

  return state[index];
};
