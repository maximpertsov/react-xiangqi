import actions from 'actions';
import client from 'services/client';

const postMove = ({ gameSlug, move, username }) => {
  const payload = { name: 'move', move, player: username };
  return client.post(`game/${gameSlug}/events`, payload);
};

const createMoveOnServer = ({
  gameSlug,
  id,
  move,
  username,
}) => async dispatch => {
  if (gameSlug === null) return;

  try {
    await postMove({ gameSlug, move, username });
  } catch (error) {
    // TODO: fetch moves to avoid client/server disparity?
    dispatch(actions.game.positions.remove({ id }));
  }
};

export default createMoveOnServer;
