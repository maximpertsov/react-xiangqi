import actions from 'actions';
import client from 'services/client';

const postMove = ({ gameSlug, fan, username }) => {
  // TODO: change `move:` after data model update on server
  const payload = { name: 'move', move: fan, player: username };
  return client.post(`game/${gameSlug}/events`, payload);
};

const createMoveOnServer = ({
  gameSlug,
  id,
  fan,
  username,
}) => async dispatch => {
  if (gameSlug === null) return;

  try {
    await postMove({ gameSlug, fan, username });
  } catch (error) {
    // TODO: fetch moves to avoid client/server disparity?
    dispatch(actions.game.positions.remove(id));
  }
};

export default createMoveOnServer;
