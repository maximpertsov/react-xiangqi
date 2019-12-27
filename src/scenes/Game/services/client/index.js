import * as client from 'services/client';

export const fetchMoves = async(dispatch, state, {gameSlug}) => {
  if (gameSlug === undefined) {
    dispatch({ type: 'set_moves', moves: [] });
    return;
  }

  const response = await client.getMoves(gameSlug);
  dispatch({ type: 'set_moves', moves: response.data.moves });
};

export default {};
