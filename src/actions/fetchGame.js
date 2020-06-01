import client from 'services/client';
import actions from 'actions';

const getGame = ({ gameSlug }) => client.get(`game/${gameSlug}`);

const setPlayers = (dispatch, { players }) => {
  dispatch(actions.game.players.set(players));
};

const setMoves = (dispatch, { moves }) => {
  dispatch(actions.game.moves.set(moves));
};

const setCurrentMoveFen = (dispatch, { currentMoveFen }) => {
  dispatch(actions.game.currentMoveFen.set(currentMoveFen));
};

const fetchGame = ({ gameSlug }) => async dispatch => {
  if (gameSlug === null) return;

  const { data } = await getGame({ gameSlug });
  setPlayers(dispatch, data);
  setMoves(dispatch, data);
  setCurrentMoveFen(dispatch, data);
};

export default fetchGame;
