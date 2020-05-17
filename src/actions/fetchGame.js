import client from 'services/client';
import actions from 'actions';

const getGame = ({ gameSlug }) => client.get(`game/${gameSlug}`);

const setPlayers = (dispatch, { players }) => {
  dispatch(actions.game.players.set(players));
};

const setMoves = (dispatch, { moves }) => {
  dispatch(actions.game.moves.set(moves));
  dispatch(actions.game.selectedMove.set(moves.length - 1));
};

const fetchGame = ({ gameSlug }) => async dispatch => {
  if (gameSlug === null) return;

  const { data } = await getGame({ gameSlug });
  setPlayers(dispatch, data);
  setMoves(dispatch, data);
};

export default fetchGame;
