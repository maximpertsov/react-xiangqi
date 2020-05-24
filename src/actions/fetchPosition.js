import actions from 'actions';
import client from 'services/client';

const fetchPosition = ({ fen, id, uci }) => async dispatch => {
  const { data } = await client.post('position', { fen });

  dispatch(actions.game.moves.update({ id, uci, ...data }));
};

export default fetchPosition;
