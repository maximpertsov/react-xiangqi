import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';

import XiangqiBoard from 'services/logic';
import { getGame } from 'services/client';

import { selectMove } from 'scenes/Game/actions';
import { getMovedPiece } from 'services/logic/move';

const updatePlayers = (dispatch, { players }) => {
  dispatch({ type: 'set_players', players });
};

const transformFetchedMove = move => {
  const data = mapKeys(move, (value, key) => camelCase(key));
  const board = new XiangqiBoard({ fen: data.fen });
  const piece = data.move ? getMovedPiece(board.placement, data.move) : null;

  return { board, piece, pending: false, ...data };
};

const updateMoves = (dispatch, { moves }) => {
  const newMoves = moves.map(transformFetchedMove);
  dispatch({ type: 'set_moves', moves: newMoves });
  dispatch(selectMove({ moveId: newMoves[newMoves.length - 1].id }));
};

const fetchGame = ({ gameSlug }) => async dispatch => {
  if (gameSlug === null) return;

  const { data } = await getGame({ gameSlug });
  updatePlayers(dispatch, data);
  updateMoves(dispatch, data);
};

export default fetchGame;
