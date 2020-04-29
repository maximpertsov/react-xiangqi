import client from 'services/client';

const fetchPosition = ({ fen, id, move }) => async dispatch => {
  const { data } = await client.post('fen', { fen });

  dispatch({
    type: 'GAME/POSITIONS/UPDATE',
    payload: { id, move, ...data },
  });
};

export default fetchPosition;
