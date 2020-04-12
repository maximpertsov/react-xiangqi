const selectedMoveId = (state = null, action) => {
  switch (action.type) {
    case 'select_move':
      return action.moveId;
    default:
      return state;
  }
};

export default selectedMoveId;
