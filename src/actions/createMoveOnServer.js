import { postMove } from 'services/client';

const createMoveOnServer = ({
  gameSlug,
  position: { id, move },
  username,
}) => async dispatch => {
  if (gameSlug === null) return;

  try {
    await postMove({ gameSlug, move, username });
  } catch (error) {
    // TODO: fetch moves to avoid client/server disparity?
    dispatch({ type: 'remove_position', id });
  }
};

export default createMoveOnServer;
