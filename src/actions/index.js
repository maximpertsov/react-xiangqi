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
  clearSelectedSlot,
  setAnimationOffset,
  setSelectedSlot,
} from 'components/Board/actions';

export default createActions({
  GAME: {
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
});
