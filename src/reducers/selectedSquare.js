const selectedSquare = (state = null, action) => {
  switch (action.type) {
    case 'BOARD/SELECTED_SQUARE/SET':
      return action.payload;
    default:
      return state;
  }
};

export default selectedSquare;
