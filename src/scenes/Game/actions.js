import * as client from 'services/client';

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

const addFetchedMove = ({
  fen,
  gives_check: givesCheck,
  legal_moves: legalMoves,
  move,
}) => {
  return addMove({ fen, legalMoves, givesCheck, move, pending: false });
};

export const fetchGame = ({ gameSlug }) => async dispatch => {
  if (gameSlug === null) return;

  const {
    data: { players },
  } = await client.getGame({ gameSlug });
  dispatch({ type: 'set_players', players });
};

export const setMove = ({ moveId, ...move }) => ({
  type: 'set_move',
  moveId,
  ...move,
});

const setInitialMove = async ({ dispatch, moves }) => {
  // TODO: massive have to avoid having no moves to start,
  // which causes other bugs. Fix those bugs instead of having this hack.
  if (moves.length === 1 && moves[0].fen === undefined) {
    const {
      data: {
        move: {
          fen,
          gives_check: givesCheck,
          legal_moves: legalMoves,
          move: fetchedMove,
        },
      },
    } = await client.getInitialMove();

    dispatch(
      setMove({
        moveId: moves[0].id,
        fen,
        givesCheck,
        legalMoves,
        move: fetchedMove,
      }),
    );
  }
};

export const fetchMoves = ({ gameSlug, moves }) => async dispatch => {
  await setInitialMove({ dispatch, moves });

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

export const getNextFen = ({
  fen,
  move: { id: moveId, move },
}) => async dispatch => {
  const {
    data: {
      move: {
        fen: fetchedFen,
        gives_check: givesCheck,
        legal_moves: legalMoves,
        move: fetchedMove,
      },
    },
  } = await client.getNextFen({ fen, move });
  dispatch(
    setMove({
      moveId,
      fen: fetchedFen,
      givesCheck,
      legalMoves,
      move: fetchedMove,
    }),
  );
};

export const postMove = ({ gameSlug, move, username }) => async dispatch => {
  if (gameSlug === null) return;

  try {
    await client.postMove({ gameSlug, move, username });
  } catch (error) {
    // TODO: fetch moves to avoid client/server disparity?
    dispatch(cancelMoves());
  }
};

export default {};
