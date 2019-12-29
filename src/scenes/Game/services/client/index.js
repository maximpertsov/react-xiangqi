import * as client from 'services/client';

import * as selectors from '../../selectors';

const POLL_INTERVAL = 2500;

export const fetchMoves = async({ dispatch, gameSlug }) => {
  if (gameSlug === undefined) {
    dispatch({ type: 'set_moves', moves: [] });
    return;
  }

  const { data: { moves } } = await client.getMoves(gameSlug);
  dispatch({ type: 'set_moves', moves });
};

export const fetchGame = async(dispatch, { gameSlug }) => {
  if (gameSlug === undefined) return;

  const { data: { players } } = await client.getGame(gameSlug);
  dispatch({ type: 'set_players', players });
};

const canUpdateMoves = ({ gameSlug, username, state }) => {
  if (gameSlug === undefined) return false;
  if (username === undefined) return false;
  if (username === selectors.getNextMovePlayer(state)) return false;

  return true;  
};

const pollMoves = async(dispatch, { gameSlug, username, state }) => {
  if (!canUpdateMoves({ gameSlug, username, state })) return;

  const { data: { move_count } } = await client.getMoveCount(gameSlug);
  if (!state.loading && state.moveCount >= move_count) return;

  fetchMoves(dispatch, { gameSlug });
};

export const setPollMovesInterval = (
  dispatch, { gameSlug, username, state }
) => setInterval(
  () => { pollMoves(dispatch, { gameSlug, state, username }); },
  POLL_INTERVAL
);

export const postMove = async(
  dispatch, { fromPos, toPos, gameSlug, username }
) => {
  if (gameSlug === undefined) return;

  try {
    const { status } = await client.postMove(gameSlug, {
      username, fromPos, toPos,
    });
    if (status !== 201) fetchMoves(dispatch, { gameSlug });

  } catch (error) {
    // TODO: display useful error?
    fetchMoves(dispatch, { gameSlug });
  }
};

export default {};
