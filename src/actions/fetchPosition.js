import actions from 'actions';
import client from 'services/client';

const fetchPosition = ({ fen, id, fan }) => async dispatch => {
  const { data } = await client.post('position', { fen });

  dispatch(actions.game.moves.update({ id, fan, ...data }));
};

export default fetchPosition;
