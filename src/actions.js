export {
  cancelMoves,
  confirmMoves,
  fetchGame,
  fetchInitialPlacement,
  fetchMoves,
  getNextFen,
  makeMove,
  pollMoves,
  postMove,
  selectMove,
  toggleLoading,
} from 'scenes/Game/actions';

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

export default {};
