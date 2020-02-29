import * as client from 'services/client';
import { decodeMove, encodeMove } from 'services/logic/square';

let nextMoveId = 0;

const addMove = move => ({ ...move, type: 'add_move', moveId: ++nextMoveId });

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

const addFetchedMove = ({ fen, legal_moves: legalMoves, move }) => {
  let [fromSlot, toSlot] = [undefined, undefined];
  if (move !== null) {
    [fromSlot, toSlot] = decodeMove(move);
  }
  return addMove({ fen, legalMoves, fromSlot, move, pending: false, toSlot });
};

export const fetchGame = ({ gameSlug }) => async dispatch => {
  if (gameSlug === null) return;

  const {
    data: { players },
  } = await client.getGame({ gameSlug });
  dispatch({ type: 'set_players', players });
};

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
        const addMoveAction = addFetchedMove(fetchedMove);
        dispatch(addMoveAction);
        return addMoveAction.moveId;
      }, lastMoveId);
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

export const setMove = ({ moveId, move }) => ({
  type: 'set_move',
  moveId,
  move,
});

export const postMove = ({
  gameSlug,
  moves,
  fromSlot,
  toSlot,
  username,
}) => async dispatch => {
  if (gameSlug === null) return;

  try {
    const { move, status } = await client.postMove({
      gameSlug,
      username,
      move: encodeMove(fromSlot, toSlot),
    });
    // TODO: add a single move instead of fetching all of them
    if (status !== 201) dispatch(fetchMoves({ gameSlug, moves }));
  } catch (error) {
    // TODO: display useful error?
    // TODO: cancel pending moves instead of re-fetching
    dispatch(fetchMoves({ gameSlug, moves }));
  }
};

export default {};
