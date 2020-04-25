import positions from 'reducers/positions';

describe('positions reducer', () => {
  it('should return the default state', () => {
    expect(positions(undefined, {})).toEqual([]);
  });

  it('should add a move', () => {
    const action = { type: 'add_position' };

    const firstPosition = { id: 0 };
    const currentState = [firstPosition];

    const expectedNewState = [
      firstPosition,
      {
        id: 1,
        fen: undefined,
        givesCheck: undefined,
        legalPositions: undefined,
        move: undefined,
        pending: undefined,
      },
    ];

    expect(positions(currentState, action)).toEqual(expectedNewState);
  });
});
