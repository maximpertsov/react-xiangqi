import { getMoveCount, getMoveIndex } from '../selectors';

const getMoveId = (moves, moveIndex) => {
  const { id } = moves[moveIndex];
  return id;
};

const setPreviousMove = (state, moves) => {
  const moveIndex = getMoveIndex({ moves }, state);
  return getMoveId(moves, Math.max(moveIndex - 1, 0));
};

const setNextMove = (state, moves) => {
  const moveIndex = getMoveIndex({ moves }, state);
  const moveCount = getMoveCount({ moves });
  return getMoveId(moves, Math.min(moveIndex + 1, moveCount));
};

const selectLastMove = (state, moves) => {
  const moveCount = getMoveCount({ moves });
  return getMoveId(moves, moveCount);
};

const selectedMoveId = (state = 0, action) => {
  switch (action.type) {
  case 'select_move':
    return action.moveId;
  case 'select_previous_move':
    return setPreviousMove(state, action.moves);
  case 'select_next_move':
    return setNextMove(state, action.moves);
  case 'select_last_move':
    return selectLastMove(state, action.moves);
  default:
    return state;
  }
};

export default selectedMoveId;
