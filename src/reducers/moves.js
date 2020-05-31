import update from 'immutability-helper';

import find from 'lodash/fp/find';
import flow from 'lodash/fp/flow';
import fromPairs from 'lodash/fp/fromPairs';
import get from 'lodash/fp/get';
import last from 'lodash/fp/last';
import pick from 'lodash/fp/pick';
import reject from 'lodash/fp/reject';
import sortBy from 'lodash/fp/sortBy';

import { activeColor, moveOrder } from 'services/logic/fen';

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

export const getHasInitialPlacement = state => state.some(({ fen }) => !!fen);

export const getLastMove = state =>
  flow(
    sortBy(({ fen }) => moveOrder(fen)),
    last,
  )(state);

// TODO: consider putting moves in an object to speed up this lookup
// TODO: consider moving out of move selectors since it requires more
// information than just the move state?
export const getMoveByFen = (state, fen) => find(['fen', fen], state);

// TODO: add a test
export const getNextMoveColor = state => {
  const lastMove = getLastMove(state);
  if (!lastMove) return Color.RED;

  const { fen } = lastMove;
  return activeColor(fen);
};

export const getFirstFenWithoutLegalMoves = state =>
  flow(
    sortBy(({ fen }) => moveOrder(fen)),
    find(move => !move.legalMoves),
    get('fen'),
  )(state);
