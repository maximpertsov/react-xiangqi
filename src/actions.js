import { getMoves } from 'services/client';
import { getSlot } from 'services/logic';

let nextMoveId = 0;

export const addMove = ({ board, fromSlot, toSlot, pending }) => ({
  type: 'add_move',
  moveId: ++nextMoveId,
  board,
  fromSlot,
  toSlot,
  pending,
});

export const selectMove = ({ moveId }) => ({
  type: 'select_move', moveId,
});

export const makeMove = ({ board, fromSlot, toSlot, pending }) =>
  (dispatch) => {
    const addMoveAction = addMove({ board, fromSlot, toSlot, pending });
    const { moveId } = addMoveAction;
    dispatch(addMoveAction);
    dispatch(selectMove({ moveId }));
  };

export const toggleLoading = ({ loading }) => ({
  type: 'toggle_loading', loading,
});

export const fetchMoves = ({ gameSlug, moves }) =>
  async(dispatch) => {
    if (gameSlug !== undefined) {
      try {
        const { data: { moves: fetchedMoves } } = await getMoves({ gameSlug });

        dispatch(toggleLoading({ loading: true }));

        fetchedMoves.forEach(
          ({ origin: fromPos, destination: toPos }, index) => {
            // Check if each fetched move has a corresponding move in app state
            // TODO: throw error if any moves mismatch
            if (moves[index + 1] === undefined) {

              // TODO: fix! the updates do not process fast enough

              // Get board from previous move in app state
              const { board } = moves[index];
              dispatch(addMove({
                board,
                fromSlot: getSlot(...fromPos),
                toSlot: getSlot(...toPos),
                pending: false,
              }));
            }
          }
        );
      } finally {
        dispatch(toggleLoading({ loading: false }));
      }
    }
  };

export default {};
