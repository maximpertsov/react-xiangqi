import client from 'services/client';
import actions from 'actions';

const getGame = ({ gameSlug }) => client.get(`game/${gameSlug}`);

const setPlayers = (dispatch, { players }) => {
  dispatch(actions.game.players.set(players));
};

const setPositions = (dispatch, { positions }) => {
  dispatch(actions.game.positions.set(positions));
  dispatch(actions.game.selectedPosition.set(positions.length - 1));
};

const fetchGame = ({ gameSlug }) => async dispatch => {
  if (gameSlug === null) return;

  const { data } = await getGame({ gameSlug });
  setPlayers(dispatch, data);
  setPositions(dispatch, data);
};

export default fetchGame;
