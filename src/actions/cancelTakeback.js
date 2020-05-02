import actions from 'actions';

const cancelTakeback = ({ gameSlug, username }) => async dispatch => {
  // post cancelUndoRequest(gameSlug, username)
  dispatch(actions.game.requestedTakeback.set(false));
};

export default cancelTakeback;
