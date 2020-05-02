import actions from 'actions';

const requestTakeback = ({ gameSlug, username }) => async dispatch => {
  // post makeUndoRequest(gameSlug, username)
  dispatch(actions.game.requestedTakeback.set(true));
};

export default requestTakeback;
