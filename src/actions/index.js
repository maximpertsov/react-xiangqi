import { createActions } from 'redux-actions';
import { Team } from 'services/logic/constants';

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
    BLACK_PLAYER: {
      SET: undefined,
    },
    BLACK_SCORE: {
      SET: undefined,
    },
    CAN_MOVE_BOTH_TEAMS: {
      SET: undefined,
    },
    MOVES: {
      ADD: undefined,
      REMOVE: undefined,
      UPDATE: undefined,
      SET: undefined,
    },
    OPEN_DRAW_OFFER: {
      SET: undefined,
    },
    OPEN_TAKEBACK_OFFER: {
      SET: undefined,
    },
    RED_PLAYER: {
      SET: undefined,
    },
    RED_SCORE: {
      SET: undefined,
    },
    SELECTED_FEN: {
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
      SET: {
        OFF: () => [],
        RED: () => [Team.RED],
        BLACK: () => [Team.BLACK],
        BOTH: () => [Team.RED, Team.BLACK],
      },
    },
    GAMES: {
      SET: undefined,
    },
    LOGIN_FORM: {
      USERNAME: {
        SET: undefined,
      },
      PASSWORD: {
        SET: undefined,
      },
      ERROR: {
        SET: undefined,
      },
      LOADING: {
        SET: undefined,
      },
    },
    SHOW_GAME: {
      SET: undefined,
    },
    USERNAME: {
      SET: undefined,
    },
  },
});
