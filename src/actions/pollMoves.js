import actions from 'actions';
import { poll } from 'services/client';
import fetchGame from 'actions/fetchGame';

const canUpdateMoves = ({ gameSlug, nextMovePlayerName, username }) => {
  if (gameSlug === null) return false;
  if (username === null) return false;
  if (username === nextMovePlayerName) return false;

  return true;
};

const pollMoves = ({
  gameSlug,
  nextMovePlayerName,
  updateCount,
  username,
}) => async dispatch => {
  if (!canUpdateMoves({ gameSlug, nextMovePlayerName, username })) return;

  const { data } = await poll({ gameSlug });
  if (updateCount >= data.updateCount) return;

  dispatch(actions.game.updateCount.set(data.updateCount));
  dispatch(fetchGame({ gameSlug }));
};

export default pollMoves;
