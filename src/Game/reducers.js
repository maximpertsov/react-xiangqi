import update from 'immutability-helper';
import { useReducer } from 'react';
import XiangqiBoard, { RefType } from '../logic';

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
  },
]);

const initialPlayers = [
  { name: undefined, color: 'red' },
  { name: undefined, color: 'black' },
];

const getInitialState = () => ({
  loading: true,
  moves: getInitialMovesState(),
  moveCount: 0,
  players: initialPlayers,
  selectedMoveIdx: 0,
});

// Actions

const incrementMoveCount = (state) => (
  { ...state, moveCount: state.moveCount + 1 }
);

const setSelectedMove = (state, index) => (
  { ...state, selectedMoveIdx: index }
);

const selectLastMove = (state) => {
  const { moves } = state;
  return setSelectedMove(state, moves.length - 1);
};

const addMove = (state, board, { fromSlot, toSlot }) => {
  const newMove = {
    fromPos: board.getRankFile(fromSlot),
    toPos: board.getRankFile(toSlot),
    piece: board.getPiece(fromSlot),
    board: board.move(fromSlot, toSlot),
  };
  return selectLastMove(
    incrementMoveCount(
      update(state, { moves: { $push: [newMove] } }),
    ),
  );
};

const setMove = (
  state,
  { piece, origin: fromPos, destination: toPos },
  fromMoveIdx = undefined,
) => {
  const { board } = state.moves[fromMoveIdx || state.moves.length - 1];
  const newMove = {
    piece,
    fromPos,
    toPos,
    board: board.move(fromPos, toPos, RefType.RANK_FILE),
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
const reducer = (state, action) => {
  switch (action.type) {
    case 'add_move':
      return addMove(state, action.board, action.move);
    case 'select_move':
      return setSelectedMove(state, action.index);
    case 'set_moves':
      return setMoves(state, action.moves);
    case 'set_players':
      return ({ ...state, players: action.players });
    default:
      return state;
  }
};

const useGameReducer = () => useReducer(
  reducer, getInitialState(),
);

export default useGameReducer;
