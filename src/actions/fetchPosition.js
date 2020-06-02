import actions from 'actions';
import client from 'services/client';

const fetchPosition = ({ fen }) => async dispatch => {
  const { data } = await client.post('position', { fen });

  dispatch(actions.game.moves.update(data));
};

export default fetchPosition;
