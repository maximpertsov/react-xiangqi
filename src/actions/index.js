import { createActions } from 'redux-actions';

export {
  fetchGames,
  setAutoMoveOff,
  setAutoMoveRed,
  setAutoMoveBlack,
  setAutoMoveBoth,
  setGameSlug,
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
    SHOW_CONFIRM_MOVE_MENU: {
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
  },
  BOARD: {
    SELECTED_SQUARE: {
      SET: undefined,
    },
  },
});
