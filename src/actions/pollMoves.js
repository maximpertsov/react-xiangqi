import actions from 'actions';
import { poll } from 'services/client';
import fetchGame from 'actions/fetchGame';

const canUpdateMoves = ({ gameSlug, username }) => {
  if (gameSlug === null) return false;
  if (username === null) return false;

  return true;
};

const pollMoves = ({ gameSlug, updateCount, username }) => async dispatch => {
  if (!canUpdateMoves({ gameSlug, username })) return;

  const { data } = await poll({ gameSlug });
  if (updateCount >= data.updateCount) return;

  dispatch(actions.game.updateCount.set(data.updateCount));
  dispatch(fetchGame({ gameSlug }));
};

export default pollMoves;
