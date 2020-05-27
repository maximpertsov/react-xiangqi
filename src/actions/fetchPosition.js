import actions from 'actions';
import client from 'services/client';

const fetchPosition = ({ fen, uci }) => async dispatch => {
  const { data } = await client.post('position', { fen });

  dispatch(actions.game.moves.update({ uci, ...data }));
};

export default fetchPosition;
