import update from 'immutability-helper';
import { combineReducers } from 'redux';

import XiangqiBoard, * as logic from 'services/logic';
import { Color } from 'services/logic/constants';

// Initial State

// TODO: define in logic class
/* eslint-disable-next-line max-len */
const DEFAULT_FEN = 'rheakaehr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR';

const getInitialMovesState = (fen = DEFAULT_FEN) => ([
  {
    piece: undefined,
    fromPos: undefined,
    toPos: undefined,
    board: new XiangqiBoard({ fen }),
    pending: false,
  },
]);

const initialPlayers = [
  { name: undefined, color: Color.RED },
  { name: undefined, color: Color.BLACK },
];

const getInitialState = () => ({
  loading: true,
  moves: getInitialMovesState(),
  moveCount: 0,
  players: initialPlayers,
  selectedMoveIdx: 0,
  foobar: 0,
});

// Actions

const incrementMoveCount = (state) => (
  { ...state, moveCount: state.moveCount + 1 }
);

const setSelectedMove = (state, index) => (
  { ...state, selectedMoveIdx: index }
);

const setPreviousMove = (state) => (
  {
    ...state,
    selectedMoveIdx: Math.max(state.selectedMoveIdx - 1, 0),
  }
);

const setNextMove = (state) => (
  {
    ...state,
    selectedMoveIdx: Math.min(state.selectedMoveIdx + 1, state.moveCount),
  }
);

const selectLastMove = (state) => {
  const { moves } = state;
  return setSelectedMove(state, moves.length - 1);
};

const addMove = (state, board, fromSlot, toSlot, pending) => {
  const newMove = {
    fromPos: logic.getRankFile(fromSlot),
    toPos: logic.getRankFile(toSlot),
    piece: board.getPiece(fromSlot),
    board: board.move(fromSlot, toSlot),
    pending,
  };
  return selectLastMove(
    incrementMoveCount(
      update(state, { moves: { $push: [newMove] } }),
    ),
  );
};

const cancelMoves = (state) => {
  const { moves, selectedMoveIdx } = state;
  const confirmedMoves = moves.filter(({ pending }) => !pending);

  return {
    ...state,
    moves: confirmedMoves,
    moveCount: confirmedMoves.length,
    selectedMoveIdx: Math.min(selectedMoveIdx, confirmedMoves.length - 1),
  };
};

const confirmMoves = (state) => {
  const { moves } = state;
  return {
    ...state,
    moves: moves.map((move) => ({ ...move, pending: false })),
  };
};

const setMove = (
  state,
  { origin: fromPos, destination: toPos },
  fromMoveIdx = undefined,
) => {
  const { board } = state.moves[fromMoveIdx || state.moves.length - 1];
  const newMove = {
    piece: board.getPiece(fromPos, logic.RefType.RANK_FILE),
    fromPos,
    toPos,
    board: board.move(fromPos, toPos, logic.RefType.RANK_FILE),
    pending: false,
  };
  return incrementMoveCount(update(state, { moves: { $push: [newMove] } }));
};


const setMoves = (state, moves) => selectLastMove(
  moves.reduce(
    (prevState, move) => setMove(prevState, move),
    {
      ...state,
      moves: getInitialMovesState(),
      moveCount: 0,
      setSelectedMove: 0,
      loading: false,
    },
  ),
);

/* eslint-disable-next-line complexity */
const reducer = (state = getInitialState(), action) => {
  switch (action.type) {
  case 'increment_foobar':
    return ({ ...state, foobar: state.foobar + 1 });
  case 'add_move':
    return addMove(
      state,
      action.board,
      action.fromSlot,
      action.toSlot,
      action.pending,
    );
  case 'cancel_moves':
    return cancelMoves(state);
  case 'confirm_moves':
    return confirmMoves(state);
  case 'select_move':
    return setSelectedMove(state, action.index);
  case 'select_previous_move':
    return setPreviousMove(state);
  case 'select_next_move':
    return setNextMove(state);
  case 'set_moves':
    return setMoves(state, action.moves);
  case 'set_players':
    return ({ ...state, players: action.players });
  default:
    return state;
  }
};

export default combineReducers({ game: reducer });
