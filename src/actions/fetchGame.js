import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';

import { getGame } from 'services/client';
import { selectMove } from 'scenes/Game/actions';

const updatePlayers = (dispatch, { players }) => {
  dispatch({ type: 'set_players', players });
};

const transformFetchedMove = move => {
  const data = mapKeys(move, (value, key) => camelCase(key));

  return { pending: false, ...data };
};

const updateMoves = (dispatch, { moves }) => {
  dispatch({ type: 'set_moves', moves: moves.map(transformFetchedMove) });
  dispatch(selectMove({ moveId: moves.length - 1 }));
};

const fetchGame = ({ gameSlug }) => async dispatch => {
  if (gameSlug === null) return;

  const { data } = await getGame({ gameSlug });
  updatePlayers(dispatch, data);
  updateMoves(dispatch, data);
};

export default fetchGame;
