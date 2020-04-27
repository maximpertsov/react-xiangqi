import { createActions } from 'redux-actions';

export const addPosition = move => ({
  type: 'add_position',
  ...move,
});

export const selectMove = ({ moveId }) => ({
  type: 'select_move',
  moveId,
});

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
    },
  },
});
