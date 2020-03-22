import * as client from 'services/client';
import {
  addMove,
  selectMove,
  toggleLoading,
  toggleMovesFetched,
  transformFetchedMove,
} from 'scenes/Game/actions';

const fetchMoves = ({ gameSlug, moves }) => async dispatch => {
  if (gameSlug === null) {
    // TODO: unnecessary?
    dispatch(toggleMovesFetched());
    return;
  }

  let lastMoveId;
  try {
    dispatch(toggleLoading({ loading: true }));

    const {
      data: { moves: fetchedMoves },
    } = await client.getMoves({ gameSlug });
    lastMoveId = fetchedMoves
      // TODO: throw error if fetched move do not match app moves
      .filter((_, index) => index > 0 && moves[index] === undefined)
      .reduce((lastMoveId, fetchedMove) => {
        const addMoveAction = addMove({
          pending: false,
          ...transformFetchedMove(fetchedMove),
        });
        dispatch(addMoveAction);
        return addMoveAction.moveId;
      }, lastMoveId);
    dispatch(toggleMovesFetched());
  } finally {
    if (lastMoveId) dispatch(selectMove({ moveId: lastMoveId }));
    dispatch(toggleLoading({ loading: false }));
  }
};

export default fetchMoves;
