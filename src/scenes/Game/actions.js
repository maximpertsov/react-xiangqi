import * as client from 'services/client';

export const addPosition = move => ({
  type: 'add_position',
  ...move,
});

export const setMove = ({ moveId, ...move }) => ({
  type: 'set_move',
  moveId,
  ...move,
});

export const selectMove = ({ moveId }) => ({
  type: 'select_move',
  moveId,
});

export const makeMove = move => dispatch => {
  dispatch(addPosition(move));
  dispatch(selectMove({ moveId: null }));
};

export const cancelMoves = () => ({
  type: 'cancel_moves',
});

export const confirmMoves = () => ({
  type: 'confirm_moves',
});

export default {};
