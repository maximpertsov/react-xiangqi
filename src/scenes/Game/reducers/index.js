import { combineReducers } from 'redux';
import loading from 'scenes/Game/reducers/loading';
import moves, * as fromMoves from 'scenes/Game/reducers/moves';
import players from 'scenes/Game/reducers/players';
import selectedMoveId from 'scenes/Game/reducers/selectedMoveId';

const game = combineReducers({ loading, moves, players, selectedMoveId });

export default game;

/***************/
/***  Moves  ***/
/***************/

export const getMoveCount = ({ moves }) => fromMoves.getMoveCount(moves);

export const getLastMove = ({ moves }) => fromMoves.getLastMove(moves);

export const getSelectedMove = ({ moves, selectedMoveId }) =>
  fromMoves.getMoveById(moves, selectedMoveId);

export const getPreviousMove = ({ moves, selectedMoveId }) =>
  fromMoves.getPreviousMove(moves, selectedMoveId);

export const getNextMove = ({ moves, selectedMoveId }) =>
  fromMoves.getNextMove(moves, selectedMoveId);

export const getNextMoveColor = ({ moves }) =>
  fromMoves.getNextMoveColor(moves);
