import client from 'services/client';
import actions from 'actions';

const fetchStartingPosition = () => async dispatch => {
  const { data } = await client.get('fen');

  dispatch(actions.game.positions.add({ fan: null, ...data }));
};

export default fetchStartingPosition;
