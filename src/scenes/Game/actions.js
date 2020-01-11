import update from 'immutability-helper';
import XiangqiBoard, * as logic from 'services/logic';
import { Color } from 'services/logic/constants';

// TODO: find out why this id starts at 3
let nextMoveId = 0;

const newMove = (moveData) => (
  {
    ...moveData,
    id: ++nextMoveId,
  }
);

/*********************/
/*** Initial State ***/
/*********************/

// TODO: define in logic class
/* eslint-disable-next-line max-len */
const DEFAULT_FEN = 'rheakaehr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR';

const getInitialMovesState = (fen = DEFAULT_FEN) => ([
  newMove({
    piece: undefined,
    fromPos: undefined,
    toPos: undefined,
    board: new XiangqiBoard({ fen }),
    pending: false,
  }),
]);

const initialPlayers = [
  { name: undefined, color: Color.RED },
  { name: undefined, color: Color.BLACK },
];

export const getInitialState = () => ({
  loading: true,
  moves: getInitialMovesState(),
  moveCount: 0,
  players: initialPlayers,
  selectedMoveId: undefined,
});

/***************/
/*** Actions ***/
/***************/

const incrementMoveCount = (state) => (
  { ...state, moveCount: state.moveCount + 1 }
);

const getMoveIndex = ({ moves }, moveId ) => {
  if (moveId === undefined) return 0;

  return moves.findIndex(({ id }) => id === moveId);
};

const setSelectedMoveIndex = (state, moveIndex) => {
  const { id: selectedMoveId } = state.moves[moveIndex];
  return { ...state, selectedMoveId };
};

export const setSelectedMove = (state, moveId) =>
  setSelectedMoveIndex(state, getMoveIndex(state, moveId));

export const setPreviousMove = (state) => {
  const moveIndex = getMoveIndex(state, state.selectedMoveId);
  return setSelectedMoveIndex(state, Math.max(moveIndex - 1, 0));
};

export const setNextMove = (state) => {
  const moveIndex = getMoveIndex(state, state.selectedMoveId);
  return setSelectedMoveIndex(state, Math.min(moveIndex + 1, state.moveCount));
};

const selectLastMove = (state) =>
  setSelectedMoveIndex(state, state.moves.length - 1);

export const addMove = (state, board, fromSlot, toSlot, pending) => {
  const move = newMove({
    fromPos: logic.getRankFile(fromSlot),
    toPos: logic.getRankFile(toSlot),
    piece: board.getPiece(fromSlot),
    board: board.move(fromSlot, toSlot),
    pending,
  });
  return selectLastMove(
    incrementMoveCount(
      update(state, { moves: { $push: [move] } }),
    ),
  );
};

export const cancelMoves = (state) => {
  const { moves, selectedMoveId } = state;
  const confirmedMoves = moves.filter(({ pending }) => !pending);
  const selectedMoveIndex = Math.min(selectedMoveId, confirmedMoves.length - 1);

  return {
    ...state,
    moves: confirmedMoves,
    moveCount: confirmedMoves.length,
    selectedMoveId: setSelectedMoveIndex(state, selectedMoveIndex),
  };
};

export const confirmMoves = (state) => {
  const { moves } = state;
  return {
    ...state,
    moves: moves.map((move) => ({ ...move, pending: false })),
  };
};

const setMove = (state, { origin: fromPos, destination: toPos }) => {
  const { board } = state.moves[state.moves.length - 1];
  const move = newMove({
    piece: board.getPiece(fromPos, logic.RefType.RANK_FILE),
    fromPos,
    toPos,
    board: board.move(fromPos, toPos, logic.RefType.RANK_FILE),
    pending: false,
  });
  return incrementMoveCount(update(state, { moves: { $push: [move] } }));
};

export const setMoves = (state, moves) =>
  selectLastMove(
    moves.reduce(
      (prevState, move) => setMove(prevState, move),
      {
        ...state,
        moves: getInitialMovesState(),
        moveCount: 0,
        loading: false,
      },
    ),
  );

export default {};
