import positions, { getMoveById } from 'reducers/positions';

describe('positions reducer', () => {
  it('should return the default state', () => {
    expect(positions(undefined, {})).toEqual([]);
  });

  describe('add position', () => {
    const action = { type: 'add_position' };

    it('should add the first position with id = 0', () => {
      const currentState = [];
      const expectedNewState = [
        {
          id: 0,
          fen: undefined,
          givesCheck: undefined,
          legalPositions: undefined,
          move: undefined,
          pending: undefined,
        },
      ];
      expect(positions(currentState, action)).toEqual(expectedNewState);
    });

    it('should add a position with an incremented id', () => {
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
});

describe('positions selectors', () => {
  test('select move by id', () => {
    const state = [
      { id: 0, move: null },
      { id: 2, move: 'a1a2' },
      { id: 3, move: 'a10a9' },
    ];
    expect(getMoveById(state, 0)).toEqual({ id: 0, move: null });
    expect(getMoveById(state, 1)).toEqual(undefined);
    expect(getMoveById(state, 2)).toEqual({ id: 2, move: 'a1a2' });
    expect(getMoveById(state, 3)).toEqual({ id: 3, move: 'a10a9' });
  });
});
