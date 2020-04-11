import { poll } from 'services/client';
import fetchGame from 'actions/fetchGame';

const canUpdateMoves = ({ gameSlug, nextMovePlayerName, username }) => {
  if (gameSlug === null) return false;
  if (username === null) return false;
  if (username === nextMovePlayerName) return false;

  return true;
};

const setUpdateCount = ({ updateCount }) => ({
  type: 'set_update_count',
  updateCount,
});

const pollMoves = ({
  gameSlug,
  nextMovePlayerName,
  updateCount,
  username,
}) => async dispatch => {
  if (!canUpdateMoves({ gameSlug, nextMovePlayerName, username })) return;

  const { data } = await poll({ gameSlug });

  const logs = [
    `Client update: ${updateCount}`,
    `Server updates: ${data.update_count}`,
    `Next move player: ${nextMovePlayerName}`,
    `Username: ${username}`,
  ];
  console.log(logs.join(', '));
  if (updateCount >= data.update_count) return;

  dispatch(setUpdateCount({ updateCount: data.update_count }));
  dispatch(fetchGame({ gameSlug }));
};

export default pollMoves;
