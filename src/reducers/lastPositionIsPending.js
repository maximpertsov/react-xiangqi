const lastPositionIsPending = (state = false, action) => {
  switch (action.type) {
    case 'update_last_position_is_pending':
      return action.value;
    default:
      return state;
  }
};

export default lastPositionIsPending;
