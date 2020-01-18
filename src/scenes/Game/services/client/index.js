import * as client from 'services/client';

const POLL_INTERVAL = 2500;

export const fetchMoves = async({ dispatch, gameSlug }) => {
  // if (gameSlug === null) {
  //   dispatch({ type: 'set_moves', moves: [] });
  //   return;
  // }
  //
  // const { data: { moves } } = await client.getMoves({ gameSlug });
  // dispatch({ type: 'set_moves', moves });
};

export const fetchGame = async({ dispatch, gameSlug }) => {
  if (gameSlug === null) return;

  const { data: { players } } = await client.getGame({ gameSlug });
  dispatch({ type: 'set_players', players });
};

const canUpdateMoves = ({ gameSlug, nextMovePlayer, username }) => {
  if (gameSlug === null) return false;
  if (username === null) return false;
  if (username === nextMovePlayer) return false;

  return true;
};

const pollMoves = async({
  dispatch,
  gameSlug,
  loading,
  moveCount,
  nextMovePlayer,
  username,
}) => {
  if (!canUpdateMoves({ gameSlug, nextMovePlayer, username })) return;

  const { data: { move_count } } = await client.getMoveCount({ gameSlug });
  if (!loading && moveCount >= move_count) return;

  fetchMoves({ dispatch, gameSlug });
};

export const setPollMovesInterval = (params) =>
  setInterval(
    () => { pollMoves(params); },
    POLL_INTERVAL
  );

export const postMove = async({
  dispatch, fromPos, toPos, gameSlug, username,
}) => {
  if (gameSlug === null) return;

  try {
    const { status } = await client.postMove({
      gameSlug, username, fromPos, toPos,
    });
    if (status !== 201) fetchMoves({ dispatch, gameSlug });

  } catch (error) {
    // TODO: display useful error?
    fetchMoves({ dispatch, gameSlug });
  }
};

export default {};
