const movesFetched = (state = false, action) => {
  switch (action.type) {
    case 'toggle_moves_fetched':
      return true;
    default:
      return state;
  }
};

export default movesFetched;
