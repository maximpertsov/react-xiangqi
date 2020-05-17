import actions from 'actions';
import client from 'services/client';

const fetchPosition = ({ fen, id, fan }) => async dispatch => {
  const { data } = await client.post('fen', { fen });

  dispatch(actions.game.positions.update({ id, fan, ...data }));
};

export default fetchPosition;
