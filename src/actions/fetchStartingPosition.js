import client from 'services/client';
import actions from 'actions';

const fetchStartingPosition = () => async dispatch => {
  const { data } = await client.post('starting-position');

  dispatch(actions.game.moves.add({ uci: null, ...data }));
};

export default fetchStartingPosition;
