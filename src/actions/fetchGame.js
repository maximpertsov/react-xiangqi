import client from 'services/client';
import actions from 'actions';

const getGame = ({ gameSlug }) => client.get(`game/${gameSlug}`);

const updatePlayers = (dispatch, { players }) => {
  dispatch({ type: 'set_players', players });
};

const setPositions = (dispatch, { positions }) => {
  dispatch(actions.game.positions.set(positions));
  dispatch(actions.game.selectedPosition.set(positions.length - 1));
};

const fetchGame = ({ gameSlug }) => async dispatch => {
  if (gameSlug === null) return;

  const { data } = await getGame({ gameSlug });
  updatePlayers(dispatch, data);
  setPositions(dispatch, data);
};

export default fetchGame;
