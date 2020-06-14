import client from 'services/client';
import actions from 'actions';

import last from 'lodash/fp/last';

const getGame = ({ gameSlug }) => client.get(`game/${gameSlug}`);

const setPlayers = (dispatch, data) => {
  dispatch(actions.game.redPlayer.set(data.redPlayer));
  dispatch(actions.game.redScore.set(data.redScore));
  dispatch(actions.game.blackPlayer.set(data.blackPlayer));
  dispatch(actions.game.blackScore.set(data.blackScore));
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
