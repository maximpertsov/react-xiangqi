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

export const fetchMoves = ({ gameSlug, moves }) =>
  async(dispatch) => {
    if (gameSlug !== undefined) {
      try {
        const { data: { moves: fetchedMoves } } = await getMoves({ gameSlug });

        dispatch(toggleLoading({ loading: true }));

        fetchedMoves.reduce(
          (lastBoard, { origin: fromPos, destination: toPos }, index) => {
            // Check if each fetched move has a corresponding move in app state
            // TODO: throw error if any moves mismatch
            if (moves[index + 1] === undefined) {

              // TODO: find first missing move and reduce from there

              // Get board from previous move in app state
              const fromSlot = getSlot(...fromPos);
              const toSlot = getSlot(...toPos);

              let board = undefined;
              if (lastBoard !== undefined) { board = lastBoard.move(fromSlot, toSlot); }
              if (moves[index] !== undefined) { board = moves[index].board; }

              dispatch(addMove({
                board,
                fromSlot,
                toSlot,
                pending: false,
              }));

              return board;
            }
          },
          undefined,
        );
      } finally {
        dispatch(toggleLoading({ loading: false }));
      }
    }
  };

export default {};
