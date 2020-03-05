import moves from 'reducers/moves';
import XiangqiBoard from 'services/logic';

describe('moves reducer', () => {
  const initialFen =
    'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w';
  const move = 'a10a9';
  const nextFen =
    '1nbakabnr/r8/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR b';

  const initialMove = {
    id: 0,
    move: null,
    piece: undefined,
    board: new XiangqiBoard({ fen: initialFen }),
    pending: false,
    legalMoves: [],
  };

  it('should return the initial state', () => {
    expect(moves(undefined, {})).toEqual([]);
  });

  it('should add a move by move', () => {
    const action = { type: 'add_move', move };

    const nextMove = {
      id: undefined,
      board: initialMove.board.move(move),
      fen: undefined,
      legalMoves: action.legalMoves,
      move,
      piece: 'r',
    };

    expect(moves([initialMove], action)).toEqual([initialMove, nextMove]);
  });

  it('should add a move by fen', () => {
    const action = { type: 'add_move', fen: nextFen, move };

    const nextMove = {
      id: undefined,
      board: new XiangqiBoard({ fen: nextFen }),
      fen: nextFen,
      givesCheck: undefined,
      legalMoves: action.legalMoves,
      move,
      piece: 'r',
    };

    expect(moves([initialMove], action)).toEqual([initialMove, nextMove]);
  });
});
