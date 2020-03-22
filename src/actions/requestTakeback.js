const setRequestedTakeback = () => ({
  type: 'set_requested_takeback',
  requestedTakeback: true,
});

const requestTakeback = ({ gameSlug, username }) => async dispatch => {
  // post makeUndoRequest(gameSlug, username)
  dispatch(setRequestedTakeback());
};

export default requestTakeback;
