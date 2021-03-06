import { createActions } from 'redux-actions';

import { Team } from 'services/logic/constants';

export default createActions({
  MESSAGES: {
    APPEND: undefined,
  },
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
    PLAYER2: {
      SET: undefined,
    },
    SCORE2: {
      SET: undefined,
    },
    CAN_MOVE_BOTH_TEAMS: {
      SET: undefined,
    },
    CONFIRMING_DRAW: {
      SET: undefined,
    },
    CONFIRMING_RESIGN: {
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
    PLAYER1: {
      SET: undefined,
    },
    SCORE1: {
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
    LOBBY_GAMES: {
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
