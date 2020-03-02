import moves, { DEFAULT_FEN } from 'reducers/moves';
import XiangqiBoard from 'services/logic';

describe('move reducers', () => {
  const initialMove = {
    id: 0,
    fromSlot: undefined,
    toSlot: undefined,
    piece: undefined,
    board: new XiangqiBoard({ fen: DEFAULT_FEN }),
    pending: false,
  };

  it('should return the initial state', () => {
    expect(moves(undefined, {})).toEqual([initialMove]);
  });

  it('should add a move', () => {
    const action = {
      fromSlot: 0,
      toSlot: 9,
      type: 'add_move',
    };

    const nextMove = {
      id: undefined,
      board: initialMove.board.move(0, 9),
      fen: undefined,
      fromSlot: 0,
      legalMoves: action.legalMoves,
      piece: initialMove.board.getPiece(0),
      pending: undefined,
      toSlot: 9,
    };

    expect(moves(undefined, action)).toEqual([initialMove, nextMove]);
  });
});
