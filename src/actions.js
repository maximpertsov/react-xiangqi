export {
  fetchGame,
  fetchMoves,
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
  toggleShowGame,
  toggleCanMoveBothColors,
} from 'scenes/Home/actions';

export { clearSelectedSlot, setSelectedSlot } from 'components/Board/actions';

export default {};
