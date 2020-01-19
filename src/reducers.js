import { combineReducers } from "redux";
// Home
import autoMove from "scenes/Home/reducers/autoMove";
import games from "scenes/Home/reducers/games";
import gameSlug from "scenes/Home/reducers/gameSlug";
import showGame from "scenes/Home/reducers/showGame";
import username from "scenes/Home/reducers/username";
// Game
import loading from "scenes/Game/reducers/loading";
import moves, * as fromMoves from "scenes/Game/reducers/moves";
import players from "scenes/Game/reducers/players";
import selectedMoveId from "scenes/Game/reducers/selectedMoveId";

const rootReducer = combineReducers({
  // Home,
  autoMove,
  games,
  gameSlug,
  showGame,
  username,
  // Game
  loading,
  moves,
  players,
  selectedMoveId,
});

export default rootReducer;

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
