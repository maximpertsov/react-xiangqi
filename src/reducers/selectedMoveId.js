const selectedMoveId = (state = 0, action) => {
  switch (action.type) {
    case 'select_move':
      return action.moveId;
    default:
      return state;
  }
};

export default selectedMoveId;
