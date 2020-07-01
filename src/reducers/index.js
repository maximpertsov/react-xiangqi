import actions from 'actions';
import { combineReducers } from 'redux';
import { Team } from 'services/logic/constants';

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
    ['black'],
  ),
  games: handleAction(
    actions.home.games.set,
    (state, action) => action.payload,
    [],
  ),
  lobbyRequests: handleAction(
    actions.home.lobbyRequests.set,
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
    true,
  ),
  username: handleAction(
    actions.home.username.set,
    (state, action) => action.payload,
    null,
  ),
  // Game
  confirmingDraw: handleAction(
    actions.game.confirmingDraw.set,
    (state, action) => action.payload,
    false,
  ),
  confirmingResign: handleAction(
    actions.game.confirmingResign.set,
    (state, action) => action.payload,
    false,
  ),
  player2: handleAction(
    actions.game.player2.set,
    (state, action) => action.payload,
    { name: 'black', team: Team.BLACK },
  ),
  score2: handleAction(
    actions.game.score2.set,
    (state, action) => action.payload,
    0.0,
  ),
  openDrawOffer: handleAction(
    actions.game.openDrawOffer.set,
    (state, action) => action.payload,
    null,
  ),
  openTakebackOffer: handleAction(
    actions.game.openTakebackOffer.set,
    (state, action) => action.payload,
    null,
  ),
  player1: handleAction(
    actions.game.player1.set,
    (state, action) => action.payload,
    { name: 'red', team: Team.RED },
  ),
  score1: handleAction(
    actions.game.score1.set,
    (state, action) => action.payload,
    0.0,
  ),
  moves,
  showConfirmMoveMenu: handleAction(
    actions.game.showConfirmMoveMenu.set,
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
  canMoveBothTeams: handleAction(
    actions.game.canMoveBothTeams.set,
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
