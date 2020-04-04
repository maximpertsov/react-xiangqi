import * as client from 'services/client';
import fetchMoves from 'actions/fetchMoves';

const canUpdateMoves = ({ gameSlug, nextMovePlayer, username }) => {
  if (gameSlug === null) return false;
  if (username === null) return false;
  if (username === nextMovePlayer) return false;

  return true;
};

const setUpdateCount = ({ updateCount }) => ({
  type: 'set_update_count',
  updateCount,
});

const pollMoves = ({
  gameSlug,
  moves,
  nextMovePlayer,
  updateCount,
  username,
}) => async dispatch => {
  if (!canUpdateMoves({ gameSlug, nextMovePlayer, username })) return;

  const {
    data: { update_count: fetchedUpdateCount },
  } = await client.poll({ gameSlug });

  if (updateCount >= fetchedUpdateCount) return;

  dispatch(setUpdateCount({ updateCount: fetchedUpdateCount }));
  dispatch(fetchMoves({ gameSlug, moves }));
};

export default pollMoves;
