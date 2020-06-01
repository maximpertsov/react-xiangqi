import client from 'services/client';
import actions from 'actions';

const fetchStartingPosition = () => async dispatch => {
  const { data } = await client.post('starting-position');

  dispatch(actions.game.moves.add({ uci: null, ...data }));
  dispatch(actions.game.selectedFen.set(data.fen));
};

export default fetchStartingPosition;
