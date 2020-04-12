export {
  addMove,
  cancelMoves,
  confirmMoves,
  fetchInitialPlacement,
  fetchMoveInfo,
  makeMove,
  postMove,
  selectMove,
  toggleMovesFetched,
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
