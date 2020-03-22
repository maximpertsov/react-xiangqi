const unsetRequestedTakeback = () => ({
  type: 'set_requested_takeback',
  requestedTakeback: false,
});

const cancelTakeback = ({ gameSlug, username }) => async dispatch => {
  // post cancelUndoRequest(gameSlug, username)
  dispatch(unsetRequestedTakeback());
};

export default cancelTakeback;
