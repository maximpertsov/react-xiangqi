import { getMoves } from 'services/client';
import { getSlot } from 'services/logic';

let nextMoveId = 0;

export const addMove = ({ fromSlot, toSlot, pending }) => ({
  type: 'add_move',
  moveId: ++nextMoveId,
  fromSlot,
  toSlot,
  pending,
});

export const selectMove = ({ moveId }) => ({
  type: 'select_move', moveId,
});

export const makeMove = ({ fromSlot, toSlot, pending }) =>
  (dispatch) => {
    const addMoveAction = addMove({ fromSlot, toSlot, pending });
    const { moveId } = addMoveAction;
    dispatch(addMoveAction);
    dispatch(selectMove({ moveId }));
  };

export const toggleLoading = ({ loading }) => ({
  type: 'toggle_loading', loading,
});

const addFetchedMove = ({ origin: fromPos, destination: toPos }) =>
  addMove({
    fromSlot: getSlot(...fromPos),
    toSlot: getSlot(...toPos),
    pending: false,
  });

export const fetchMoves = ({ gameSlug, moves }) =>
  async(dispatch) => {
    if (gameSlug === null) return;

    let lastMoveId;
    try {
      dispatch(toggleLoading({ loading: true }));

      const { data: { moves: fetchedMoves } } = await getMoves({ gameSlug });
      lastMoveId = fetchedMoves
        // TODO: throw error if fetched move do not match app moves
        .filter((_, index) => moves[index + 1] === undefined)
        .reduce((lastMoveId, fetchedMove) => {
          const addMoveAction = addFetchedMove(fetchedMove);
          dispatch(addMoveAction);
          return addMoveAction.moveId;
        }, lastMoveId);
    } finally {
      if (lastMoveId) dispatch(selectMove({ moveId: lastMoveId }));
      dispatch(toggleLoading({ loading: false }));
    }
  };

export default {};
