import { createActions } from 'redux-actions';

export {
  fetchGames,
  setAutoMoveOff,
  setAutoMoveRed,
  setAutoMoveBlack,
  setAutoMoveBoth,
  setForm,
  setUsername,
  toggleShowGame,
  toggleCanMoveBothColors,
} from 'scenes/Home/actions';

export {
  clearAnimationOffset,
  setAnimationOffset,
} from 'components/Board/actions';

export default createActions({
  GAME: {
    PLAYERS: {
      SET: undefined,
    },
    POSITIONS: {
      ADD: undefined,
      REMOVE: undefined,
      UPDATE: undefined,
      SET: undefined,
    },
    SELECTED_POSITION: {
      SET: undefined,
    },
    SHOW_CONFIRM_MOVE_MENU: {
      SET: undefined,
    },
    SLUG: {
      SET: undefined,
    },
  },
  BOARD: {
    SELECTED_SQUARE: {
      SET: undefined,
    },
  },
});
