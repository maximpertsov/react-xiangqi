import * as client from 'services/client';

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

export const pollForMoveUpdate = async(dispatch, {gameSlug, state}) => {
  const response = await client.getMoveCount(gameSlug);
  if (!state.loading && state.moveCount >= response.data.move_count) return;

  fetchMoves(dispatch, { gameSlug });
};

export default {};
