import * as client from 'services/client';

import * as selectors from '../../selectors';

const POLL_INTERVAL = 2500;

export const fetchMoves = async(dispatch, {gameSlug}) => {
  if (gameSlug === undefined) {
    dispatch({ type: 'set_moves', moves: [] });
    return;
  }

  const response = await client.getMoves(gameSlug);
  dispatch({ type: 'set_moves', moves: response.data.moves });
};

export const fetchGame = async(dispatch, {gameSlug}) => {
  if (gameSlug === undefined) return;

  const response = await client.getGame(gameSlug);
  dispatch({ type: 'set_players', players: response.data.players });
};

const canUpdateMoves = ({gameSlug, username, state}) => {
  if (gameSlug === undefined) return false;
  if (username === undefined) return false;
  if (username === selectors.getNextMovePlayer(state)) return false;

  return true;  
};

const pollMoves = async(dispatch, {gameSlug, username, state}) => {
  if (!canUpdateMoves({gameSlug, username, state})) return;

  const response = await client.getMoveCount(gameSlug);
  if (!state.loading && state.moveCount >= response.data.move_count) return;

  fetchMoves(dispatch, { gameSlug });
};

export const setPollMovesInterval = (
  dispatch, {gameSlug, username, state}
) => setInterval(
  () => { pollMoves(dispatch, {gameSlug, state, username}); },
  POLL_INTERVAL
);

export const postMoveToServer = async(
  dispatch,
  { fromPos, toPos, gameSlug, username }
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
