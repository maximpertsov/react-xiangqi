import { getGame } from 'services/client';
import { addMove, selectMove, transformFetchedMove } from 'scenes/Game/actions';

const dispatchSetPlayers = (dispatch, { players }) => {
  dispatch({ type: 'set_players', players });
};

const dispatchAddMoves = (dispatch, { moves }) => {
  moves.forEach((move, index, moves) => {
    const action = addMove({ pending: false, ...transformFetchedMove(move) });
    dispatch(action);
    if (index === moves.length - 1) {
      dispatch(selectMove({ moveId: action.moveId }));
    }
  });
};

const fetchGame = ({ gameSlug }) => async dispatch => {
  if (gameSlug === null) return;

  const { data } = await getGame({ gameSlug });
  dispatchSetPlayers(dispatch, data);
  dispatchAddMoves(dispatch, data);
};

export default fetchGame;
