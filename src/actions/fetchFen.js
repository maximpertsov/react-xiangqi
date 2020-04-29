import { getMoveData } from 'services/client';

export const fetchPosition = ({ fen, id: moveId, move }) => async dispatch => {
  const { data } = await getMoveData({ fen });

  dispatch({
    type: 'set_move',
    moveId,
    move,
    ...data,
  });
};

export default {};
