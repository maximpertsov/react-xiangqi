import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';
import { getInitialMove, getNextFen } from 'services/client';

const transformFetchedData = data =>
  mapKeys(data, (value, key) => camelCase(key));

export const fetchInitialPlacement = () => async dispatch => {
  const { data } = await getInitialMove();

  dispatch({
    type: 'add_move',
    move: null,
    pending: false,
    ...transformFetchedData(data),
  });
};

export const fetchMissingMoveData = ({
  fen,
  id: moveId,
  move,
}) => async dispatch => {
  const { data } = await getNextFen({ fen });

  dispatch({
    type: 'set_move',
    moveId,
    move,
    ...transformFetchedData(data),
  });
};

export default {};
