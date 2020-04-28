import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';
import { getInitialPosition, getMoveData } from 'services/client';
import actions from 'actions';

const transformFetchedData = data =>
  mapKeys(data, (value, key) => camelCase(key));

export const fetchInitialPosition = () => async dispatch => {
  const { data } = await getInitialPosition();

  dispatch(
    actions.game.positions.add({
      move: null,
      ...transformFetchedData(data),
    }),
  );
};

export const fetchMissingMoveData = ({
  fen,
  id: moveId,
  move,
}) => async dispatch => {
  const { data } = await getMoveData({ fen });

  dispatch({
    type: 'set_move',
    moveId,
    move,
    ...transformFetchedData(data),
  });
};

export default {};
