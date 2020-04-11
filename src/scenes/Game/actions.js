import * as client from 'services/client';

export const addMove = move => ({
  ...move,
  type: 'add_move',
  moveId: Infinity,
});

export const setMove = ({ moveId, ...move }) => ({
  type: 'set_move',
  moveId,
  ...move,
});

export const selectMove = ({ moveId }) => ({
  type: 'select_move',
  moveId,
});

export const makeMove = move => dispatch => {
  const addMoveAction = addMove(move);
  const { moveId } = addMoveAction;
  dispatch(addMoveAction);
  dispatch(selectMove({ moveId }));
};

export const cancelMoves = () => ({
  type: 'cancel_moves',
});

export const confirmMoves = () => ({
  type: 'confirm_moves',
});

export const toggleLoading = ({ loading }) => ({
  type: 'toggle_loading',
  loading,
});

// TODO: util?
export const transformFetchedMove = ({
  fen,
  gives_check: givesCheck,
  legal_moves: legalMoves,
  move,
}) => ({ fen, legalMoves, givesCheck, move });

export const fetchInitialPlacement = () => async dispatch => {
  const {
    data: { move: fetchedMove },
  } = await client.getInitialMove();

  dispatch(addMove({ pending: false, ...transformFetchedMove(fetchedMove) }));
};

export const fetchMoveInfo = ({
  fen,
  move: { id: moveId, move, pending },
}) => async dispatch => {
  const {
    data: { move: fetchedMove },
  } = await client.getNextFen({ fen, move });
  dispatch(setMove({ moveId, pending, ...transformFetchedMove(fetchedMove) }));
};

export const toggleMovesFetched = () => ({ type: 'toggle_moves_fetched' });

export const postMove = ({
  gameSlug,
  move: { move },
  username,
}) => async dispatch => {
  if (gameSlug === null) return;

  try {
    await client.postMove({ gameSlug, move, username });
  } catch (error) {
    // TODO: fetch moves to avoid client/server disparity?
    dispatch(cancelMoves());
  }
};

export default {};
