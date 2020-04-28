import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';
import { getInitialMove, getMoveData } from 'services/client';
import actions from 'actions';

const transformFetchedData = data =>
  mapKeys(data, (value, key) => camelCase(key));

export const fetchInitialPlacement = () => async dispatch => {
  const { data } = await getInitialMove();

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
