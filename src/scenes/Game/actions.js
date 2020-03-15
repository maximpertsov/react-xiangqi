import * as client from 'services/client';

let nextMoveId = 0;

const addMove = move => ({ ...move, type: 'add_move', moveId: ++nextMoveId });

const setMove = ({ moveId, ...move }) => ({
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

const transformFetchedMove = ({
  fen,
  gives_check: givesCheck,
  legal_moves: legalMoves,
  move,
}) => ({ fen, legalMoves, givesCheck, move });

export const fetchGame = ({ gameSlug }) => async dispatch => {
  if (gameSlug === null) return;

  const {
    data: { players },
  } = await client.getGame({ gameSlug });
  dispatch({ type: 'set_players', players });
};

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

const toggleMovesFetched = () => ({ type: 'toggle_moves_fetched' });

export const fetchMoves = ({ gameSlug, moves }) => async dispatch => {
  if (gameSlug === null) return;

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

const canUpdateMoves = ({ gameSlug, nextMovePlayer, username }) => {
  if (gameSlug === null) return false;
  if (username === null) return false;
  if (username === nextMovePlayer) return false;

  return true;
};

export const pollMoves = ({
  gameSlug,
  moveCount,
  moves,
  nextMovePlayer,
  username,
}) => async dispatch => {
  if (!canUpdateMoves({ gameSlug, nextMovePlayer, username })) return;

  const {
    data: { move_count },
  } = await client.getMoveCount({ gameSlug });

  if (moveCount >= move_count) return;

  dispatch(fetchMoves({ gameSlug, moves }));
};

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
