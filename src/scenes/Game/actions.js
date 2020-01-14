let nextMoveId = 0;

export const addMove = ({ board, fromSlot, toSlot, pending }) => ({
  type: 'add_move',
  moveId: ++nextMoveId,
  board,
  fromSlot,
  toSlot,
  pending,
});

export default {};
