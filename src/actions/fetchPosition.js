import actions from 'actions';
import client from 'services/client';

const fetchPosition = ({ fen, id, move }) => async dispatch => {
  const { data } = await client.post('fen', { fen });

  dispatch(actions.game.positions.update({ id, move, ...data }));
};

export default fetchPosition;
