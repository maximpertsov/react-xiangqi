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

const createMoveOnServer = (
  io,
  { gameSlug, uci, fen, username },
) => async dispatch => {
  if (gameSlug === null) return;

  return postMove({ gameSlug, uci, fen, username })
    .then(() => {
      io.send({ gameSlug, type: 'move', username });
    })
    .catch(() => {
      dispatch(actions.game.moves.remove(fen));
    });
};

export default createMoveOnServer;
