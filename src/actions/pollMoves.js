import { poll } from 'services/client';
import fetchGame from 'actions/fetchGame';

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
  nextMovePlayer,
  updateCount,
  username,
}) => async dispatch => {
  if (!canUpdateMoves({ gameSlug, nextMovePlayer, username })) return;

  const {
    data: { update_count: fetchedUpdateCount },
  } = await poll({ gameSlug });

  if (updateCount >= fetchedUpdateCount) return;

  dispatch(setUpdateCount({ updateCount: fetchedUpdateCount }));
  dispatch(fetchGame({ gameSlug }));
};

export default pollMoves;
