const pendingPositionId = (state = null, action) => {
  switch (action.type) {
    case 'update_pending_position':
      return action.id;
    default:
      return state;
  }
};

export default pendingPositionId;
