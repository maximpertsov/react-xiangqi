import client from 'services/client';
import actions from 'actions';

import last from 'lodash/fp/last';

const getGame = ({ gameSlug }) => client.get(`game/${gameSlug}`);

const setPlayers = (dispatch, data) => {
  dispatch(actions.game.player1.set(data.player1));
  dispatch(actions.game.score1.set(data.score1));
  dispatch(actions.game.player2.set(data.player2));
  dispatch(actions.game.score2.set(data.score2));
};

const setMoves = (dispatch, { moves }) => {
  dispatch(actions.game.selectedFen.set(last(moves).fen));
  dispatch(actions.game.moves.set(moves));
};

const fetchGame = ({ gameSlug }) => async dispatch => {
  if (gameSlug === null) return;

  const { data } = await getGame({ gameSlug });

  setPlayers(dispatch, data);
  setMoves(dispatch, data);

  dispatch(actions.game.openDrawOffer.set(data.openDrawOffer));
  dispatch(actions.game.openTakebackOffer.set(data.openTakebackOffer));
};

export default fetchGame;
