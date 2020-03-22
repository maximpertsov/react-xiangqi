const requestedTakeback = (state = false, action) => {
  switch (action.type) {
    case 'set_requested_takeback':
      return action.requestedTakeback;
    default:
      return state;
  }
};

export default requestedTakeback;
