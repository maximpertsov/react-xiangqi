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

export default createActions({
  BOARD: {
    ANIMATION_OFFSET: {
      SET: undefined,
      CLEAR: () => [0, 0],
    },
    SELECTED_SQUARE: {
      SET: undefined,
    },
  },
  GAME: {
    CAN_MOVE_BOTH_COLORS: {
      SET: undefined,
    },
    REQUESTED_TAKEBACK: {
      SET: undefined,
    },
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
    UPDATE_COUNT: {
      SET: undefined,
    },
  },
  HOME: {
    AUTO_MOVE: {
      SET: undefined,
    },
    SHOW_GAME: {
      SET: undefined,
    },
    USERNAME: {
      SET: undefined,
    },
  },
});
