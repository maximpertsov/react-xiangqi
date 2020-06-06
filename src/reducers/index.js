import actions from 'actions';
import { combineReducers } from 'redux';
import { Color } from 'services/logic/constants';

import { handleAction, combineActions } from 'redux-actions';

// Home
import loginForm from './loginForm';
// Game
import moves from './moves';

const rootReducer = combineReducers({
  // Home,
  autoMove: handleAction(
    combineActions(
      actions.home.autoMove.set.off,
      actions.home.autoMove.set.red,
      actions.home.autoMove.set.black,
      actions.home.autoMove.set.both,
    ),
    (state, action) => action.payload,
    [],
  ),
  games: handleAction(
    actions.home.games.set,
    (state, action) => action.payload,
    [],
  ),
  gameSlug: handleAction(
    actions.game.slug.set,
    (state, action) => action.payload,
    null,
  ),
  loginForm,
  showGame: handleAction(
    actions.home.showGame.set,
    (state, action) => action.payload,
    false,
  ),
  username: handleAction(
    actions.home.username.set,
    (state, action) => action.payload,
    null,
  ),
  // Game
  blackPlayer: handleAction(
    actions.game.blackPlayer.set,
    (state, action) => action.payload,
    { name: 'black', color: Color.BLACK },
  ),
  blackScore: handleAction(
    actions.game.blackScore.set,
    (state, action) => action.payload,
    0.0,
  ),
  redPlayer: handleAction(
    actions.game.redPlayer.set,
    (state, action) => action.payload,
    { name: 'red', color: Color.RED },
  ),
  redScore: handleAction(
    actions.game.redScore.set,
    (state, action) => action.payload,
    0.0,
  ),
  moves,
  showConfirmMoveMenu: handleAction(
    actions.game.showConfirmMoveMenu.set,
    (state, action) => action.payload,
    false,
  ),
  requestedTakeback: handleAction(
    actions.game.requestedTakeback.set,
    (state, action) => action.payload,
    false,
  ),
  selectedFen: handleAction(
    actions.game.selectedFen.set,
    (state, action) => action.payload,
    null,
  ),
  updateCount: handleAction(
    actions.game.updateCount.set,
    (state, action) => action.payload,
    -1,
  ),
  // Board
  animationOffset: handleAction(
    combineActions(
      actions.board.animationOffset.set,
      actions.board.animationOffset.clear,
    ),
    (state, action) => action.payload,
    [0, 0],
  ),
  canMoveBothColors: handleAction(
    actions.game.canMoveBothColors.set,
    (state, action) => action.payload,
    false,
  ),
  selectedSquare: handleAction(
    actions.board.selectedSquare.set,
    (state, action) => action.payload,
    null,
  ),
});

export default rootReducer;

export * from 'reducers/selectors';
