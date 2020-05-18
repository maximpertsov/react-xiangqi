import actions from 'actions';
import client from 'services/client';

const postMove = ({ gameSlug, fan, fen, username }) => {
  // TODO: change `move:` after data model update on server
  const payload = {
    game: gameSlug,
    name: 'move',
    payload: { fan, fen, player: username },
  };
  return client.post(`game/events`, payload);
};

const createMoveOnServer = ({
  gameSlug,
  id,
  fan,
  fen,
  username,
}) => async dispatch => {
  if (gameSlug === null) return;

  try {
    await postMove({ gameSlug, fan, fen, username });
  } catch (error) {
    // TODO: fetch moves to avoid client/server disparity?
    dispatch(actions.game.moves.remove(id));
  }
};

export default createMoveOnServer;
