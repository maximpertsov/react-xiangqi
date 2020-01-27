import * as client from 'services/client';
import { getSlot } from 'services/logic';
import { getRankFile } from 'services/logic/utils';

/************/
/*** Game ***/
/************/
let nextMoveId = 0;

const addMove = ({ fromSlot, toSlot, pending }) => ({
  type: 'add_move',
  moveId: ++nextMoveId,
  fromSlot,
  toSlot,
  pending,
});

export const selectMove = ({ moveId }) => ({
  type: 'select_move',
  moveId,
});

export const makeMove = ({ fromSlot, toSlot, pending }) => dispatch => {
  const addMoveAction = addMove({ fromSlot, toSlot, pending });
  const { moveId } = addMoveAction;
  dispatch(addMoveAction);
  dispatch(selectMove({ moveId }));
};

export const toggleLoading = ({ loading }) => ({
  type: 'toggle_loading',
  loading,
});

const addFetchedMove = ({ origin: fromPos, destination: toPos }) =>
  addMove({
    fromSlot: getSlot(...fromPos),
    toSlot: getSlot(...toPos),
    pending: false,
  });

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

const canUpdateMoves = ({ gameSlug, nextMovePlayer, username }) => {
  if (gameSlug === null) return false;
  if (username === null) return false;
  if (username === nextMovePlayer) return false;

  return true;
};

export const pollMoves = ({
  gameSlug,
  loading,
  moveCount,
  moves,
  nextMovePlayer,
  username,
}) => async dispatch => {
  if (!canUpdateMoves({ gameSlug, nextMovePlayer, username })) return;

  const {
    data: { move_count },
  } = await client.getMoveCount({ gameSlug });
  if (!loading && moveCount >= move_count) return;

  dispatch(fetchMoves({ gameSlug, moves }));
};

export const postMove = ({
  gameSlug,
  moves,
  fromSlot,
  toSlot,
  username,
}) => async dispatch => {
  if (gameSlug === null) return;

  try {
    const { status } = await client.postMove({
      gameSlug,
      username,
      fromPos: getRankFile(fromSlot),
      toPos: getRankFile(toSlot),
    });
    if (status !== 201) dispatch(fetchMoves({ gameSlug, moves }));
  } catch (error) {
    // TODO: display useful error?
    dispatch(fetchMoves({ gameSlug, moves }));
  }
};

export {
  fetchGames,
  setAutoMoveOff,
  setAutoMoveRed,
  setAutoMoveBlack,
  setAutoMoveBoth,
  toggleShowGame,
  toggleCanMoveBothColors,
} from 'scenes/Home/actions';

export default {};
