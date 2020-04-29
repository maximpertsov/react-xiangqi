import client from 'services/client';
import { selectMove } from 'actions';

const getGame = ({ gameSlug }) => client.get(`game/${gameSlug}`);

const updatePlayers = (dispatch, { players }) => {
  dispatch({ type: 'set_players', players });
};

const updateMoves = (dispatch, { moves }) => {
  dispatch({ type: 'set_moves', moves });
  dispatch(selectMove({ moveId: moves.length - 1 }));
};

const fetchGame = ({ gameSlug }) => async dispatch => {
  if (gameSlug === null) return;

  const { data } = await getGame({ gameSlug });
  updatePlayers(dispatch, data);
  updateMoves(dispatch, data);
};

export default fetchGame;
