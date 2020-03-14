const autoMove = (state = [], action) => {
  switch (action.type) {
    case 'set_auto_move':
      return action.colors;
    default:
      return state;
  }
};

export default autoMove;
