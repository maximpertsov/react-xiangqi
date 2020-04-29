const selectedMoveId = (state = null, action) => {
  switch (action.type) {
    case 'GAME/SELECTED_POSITION/SET':
      return action.payload;
    default:
      return state;
  }
};

export default selectedMoveId;
