const selectedSquare = (state = null, action) => {
  switch (action.type) {
    case 'set_selected_slot':
      return action.selectedSquare;
    default:
      return state;
  }
};

export default selectedSquare;
