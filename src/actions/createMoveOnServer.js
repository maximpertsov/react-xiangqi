import actions from 'actions';
import client from 'services/client';

const postMove = ({ gameSlug, uci, fen, username }) => {
  // TODO: change `move:` after data model update on server
  const payload = {
    game: gameSlug,
    name: 'move',
    payload: { uci, fen, player: username },
  };
  return client.post(`game/events`, payload);
};

const createMoveOnServer = ({
  gameSlug,
  uci,
  fen,
  username,
}) => async dispatch => {
  if (gameSlug === null) return;

  postMove({ gameSlug, uci, fen, username }).catch(() =>
    dispatch(actions.game.moves.remove(fen)),
  );
};

export default createMoveOnServer;
