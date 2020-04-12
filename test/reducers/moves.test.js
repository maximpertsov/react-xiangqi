import moves from 'reducers/moves';

describe('moves reducer', () => {
  const initialMove = {
    id: 0,
  };

  it('should return the initial state', () => {
    expect(moves(undefined, {})).toEqual([]);
  });

  it('should add a move', () => {
    const action = { type: 'add_move' };

    const nextMove = {
      id: 1,
      fen: undefined,
      givesCheck: undefined,
      legalMoves: undefined,
      move: undefined,
      pending: undefined,
    };

    expect(moves([initialMove], action)).toEqual([initialMove, nextMove]);
  });
});
