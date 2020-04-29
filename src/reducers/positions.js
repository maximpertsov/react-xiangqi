import update from 'immutability-helper';

import findIndex from 'lodash/findIndex';
import fromPairs from 'lodash/fromPairs';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import last from 'lodash/last';
import reject from 'lodash/reject';
import sortedIndexBy from 'lodash/sortedIndexBy';

import { decode as decodeFen } from 'services/logic/fen';

import { Color } from 'services/logic/constants';

const getMoveIndex = (state, moveId) => {
  const moveIndex = sortedIndexBy(state, { id: moveId }, 'id');
  if (state[moveIndex] && state[moveIndex].id === moveId) return moveIndex;
  return -1;
};

const positionFields = ['id', 'fen', 'givesCheck', 'legalMoves', 'move'];

const createPosition = properties => ({
  ...fromPairs(positionFields.map(field => [field, undefined])),
  ...pick(properties, positionFields),
});

const addPosition = (state, payload) => {
  const nextId = isEmpty(state) ? 0 : last(state).id + 1;

  return update(state, {
    $push: [createPosition({ ...payload, id: nextId })],
  });
};

const removePosition = (state, payload) =>
  reject(state, ({ id }) => payload.id === id);

const updatePosition = (state, payload) =>
  state.map(position => {
    if (payload.id === position.id) {
      return createPosition({ ...position, ...payload });
    }
    return position;
  });

const setPositions = (state, payload) => {
  return payload.positions.map((move, index) =>
    createPosition({ ...move, id: index }),
  );
};

// eslint-disable-next-line complexity
const positions = (state = [], action) => {
  switch (action.type) {
    case 'GAME/POSITIONS/ADD':
      return addPosition(state, action.payload);
    case 'GAME/POSITIONS/REMOVE':
      return removePosition(state, action.payload);
    case 'GAME/POSITIONS/UPDATE':
      return updatePosition(state, action.payload);
    case 'GAME/POSITIONS/SET':
      return setPositions(state, action.payload);
    default:
      return state;
  }
};

export default positions;

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
