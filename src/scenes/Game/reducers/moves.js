import update from 'immutability-helper';
import XiangqiBoard, * as logic from 'services/logic';
import { newMove } from '../actions';

/* eslint-disable-next-line max-len */
const DEFAULT_FEN = 'rheakaehr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR';

const initialMoves = [
  newMove({
    piece: undefined,
    fromPos: undefined,
    toPos: undefined,
    board: new XiangqiBoard({ DEFAULT_FEN }),
    pending: false,
  }),
];

const addMove = (state, board, fromSlot, toSlot, pending) => {
  const move = newMove({
    fromPos: logic.getRankFile(fromSlot),
    toPos: logic.getRankFile(toSlot),
    piece: board.getPiece(fromSlot),
    board: board.move(fromSlot, toSlot),
    pending,
  });
  return update(state, { $push: [move] });
};

const cancelMoves = (state) => {
  const confirmedMoves = state.filter(({ pending }) => !pending);

  return confirmedMoves;
};

const confirmMoves = (state) => {
  return state.map((move) => ({ ...move, pending: false }));
};

const setMove = (state, { origin: fromPos, destination: toPos }) => {
  // TODO: get last move selector?
  const { board } = state[state.length - 1];
  const move = newMove({
    piece: board.getPiece(fromPos, logic.RefType.RANK_FILE),
    fromPos,
    toPos,
    board: board.move(fromPos, toPos, logic.RefType.RANK_FILE),
    pending: false,
  });
  return update(state, { $push: [move] });
};

const setMoves = (state, moves) =>
  moves.reduce(
    (prevState, move) => setMove(prevState, move),
    initialMoves,
  );

const moves = (state = initialMoves, action) => {
  switch (action.type) {
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
  case 'set_moves':
    return setMoves(state, action.moves);
  default:
    return state;
  }
};

export default moves;
