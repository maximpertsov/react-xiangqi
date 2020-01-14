let nextMoveId = 0;

export const addMove = ({ board, fromSlot, toSlot, pending }) => ({
  type: 'add_move',
  moveId: ++nextMoveId,
  board,
  fromSlot,
  toSlot,
  pending,
});

export const selectMove = ({ moveId }) => ({
  type: 'select_move', moveId,
});

export const makeMove = ({ board, fromSlot, toSlot, pending }) =>
  (dispatch) => {
    const addMoveAction = addMove({ board, fromSlot, toSlot, pending });
    const { moveId } = addMoveAction;
    dispatch(addMoveAction);
    dispatch(selectMove({ moveId }));
  };

export default {};
