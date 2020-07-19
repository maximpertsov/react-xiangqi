import actions from 'actions';
import client from 'services/client';

const fetchStartingPosition = () => async dispatch => {
  const { data } = await client.post('starting-position');

  dispatch(actions.game.selectedFen.set(data.fen));
  dispatch(actions.game.moves.add({ uci: null, ...data }));
};

export default fetchStartingPosition;
