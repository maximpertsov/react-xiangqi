import positions from 'reducers/positions';

describe('positions reducer', () => {
  it('should return the default state', () => {
    expect(positions(undefined, {})).toEqual([]);
  });

  it('should add a positions', () => {
    const action = { type: 'add_position' };

    const currentState = [{ id: 0 }];
    const expectedNewState = [
      { id: 0 },
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

  it('should remove given position', () => {
    const action = { type: 'remove_position', id: 1 };

    const currentState = [
      { id: 0, move: null },
      { id: 1, move: 'a1a2' },
      { id: 2, move: 'a10a9' },
    ];
    const expectedNewState = [
      { id: 0, move: null },
      { id: 2, move: 'a10a9' },
    ];
    expect(positions(currentState, action)).toEqual(expectedNewState);
  });

  describe('cancel pending positions', () => {
    const action = { type: 'cancel_pending_position' };

    it('should the last position if it is pending', () => {
      const currentState = [
        { id: 0, pending: false },
        { id: 1, pending: true },
      ];
      const expectedNewState = [{ id: 0, pending: false }];

      expect(positions(currentState, action)).toEqual(expectedNewState);
    });

    it('should not cancel a pending position that is not the last move', () => {
      const currentState = [
        { id: 0, pending: true },
        { id: 1, pending: false },
      ];
      const expectedNewState = currentState;

      expect(positions(currentState, action)).toEqual(expectedNewState);
    });
  });
});
