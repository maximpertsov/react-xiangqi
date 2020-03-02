import moves from 'reducers/moves';
import XiangqiBoard from 'services/logic';

describe('move reducers', () => {
  const initialFen =
    'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';

  const initialMove = {
    id: 0,
    fromSlot: undefined,
    toSlot: undefined,
    piece: undefined,
    board: new XiangqiBoard({ fen: initialFen }),
    pending: false,
  };

  it('should return the initial state', () => {
    expect(moves(undefined, {})).toEqual([initialMove]);
  });

  it('should add a move by from/to slot', () => {
    const move = 'a10a9';
    const action = { type: 'add_move', move };

    const nextMove = {
      id: undefined,
      board: initialMove.board.move(move),
      fen: undefined,
      fromSlot: undefined,
      legalMoves: action.legalMoves,
      move,
      piece: 'r',
      pending: undefined,
      toSlot: undefined,
    };

    expect(moves(undefined, action)).toEqual([initialMove, nextMove]);
  });

  it('should add a move by fen', () => {
    const fen = '1nbakabnr/r8/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';
    const move = 'a10a9';
    const action = { type: 'add_move', fen, move };

    const nextMove = {
      id: undefined,
      board: initialMove.board.move(move),
      fen,
      fromSlot: undefined,
      legalMoves: action.legalMoves,
      move,
      piece: 'r',
      pending: undefined,
      toSlot: undefined,
    };

    expect(moves(undefined, action)).toEqual([initialMove, nextMove]);
  });
});
