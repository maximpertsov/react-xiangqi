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

const getInitialState = () => ({
  selectedMove: 0,
  moves: getInitialMovesState(),
});

// Actions

const setSelectedMove = (state, index) => (
  { ...state, selectedMove: index }
);

const selectLastMove = (state) => {
  const { moves } = state;
  return setSelectedMove(state, moves.length - 1);
};

const addMoveToBoard = (state, board, { fromSlot, toSlot }) => {
  const newMove = {
    fromPos: board.getRankFile(fromSlot),
    toPos: board.getRankFile(toSlot),
    piece: board.getPiece(fromSlot),
    board: board.move(fromSlot, toSlot),
  };
  return selectLastMove(update(state, { moves: { $push: [newMove] } }));
};

const syncMove = (state, { piece, origin: fromPos, destination: toPos }) => {
  const { board } = state.moves[state.moves.length - 1];
  const newMove = {
    piece,
    fromPos,
    toPos,
    board: board.move(fromPos, toPos, RefType.RANK_FILE),
  };
  return update(state, { moves: { $push: [newMove] } });
};


const syncMoves = (state, moves) => selectLastMove(
  moves.reduce(
    (prevState, move) => syncMove(prevState, move),
    state,
  ),
);

const reducer = (state, action) => {
  switch (action.type) {
    case 'add_move':
      return addMoveToBoard(state, action.board, action.move);
    case 'select_move':
      return setSelectedMove(state, action.index);
    case 'sync_game':
      return syncMoves(getInitialState(), action.moves);
    default:
      return state;
  }
};

const useGameReducer = () => useReducer(
  reducer, getInitialState(),
);

export default useGameReducer;
