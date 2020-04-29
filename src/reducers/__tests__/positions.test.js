import positions, { getLastMove, getMoveById } from 'reducers/positions';

const createMove = (options = {}) => ({
  id: undefined,
  fen: undefined,
  givesCheck: undefined,
  legalMoves: undefined,
  move: undefined,
  ...options,
});

describe('positions reducer', () => {
  it('should return the default state', () => {
    expect(positions(undefined, {})).toEqual([]);
  });

  describe('add position', () => {
    const action = { type: 'GAME/POSITIONS/ADD', payload: {} };

    it('should add the first position with id = 0', () => {
      const currentState = [];
      const expectedNewState = [createMove({ id: 0 })];
      expect(positions(currentState, action)).toEqual(expectedNewState);
    });

    it('should add a position with an incremented id', () => {
      const currentState = [createMove({ id: 0 })];
      const expectedNewState = [createMove({ id: 0 }), createMove({ id: 1 })];
      expect(positions(currentState, action)).toStrictEqual(expectedNewState);
    });
  });

  it('should remove given position', () => {
    const action = { type: 'remove_position', id: 1 };

    const currentState = [
      createMove({ id: 0, move: null }),
      createMove({ id: 1, move: 'a1a2' }),
      createMove({ id: 2, move: 'a10a9' }),
    ];
    const expectedNewState = [
      createMove({ id: 0, move: null }),
      createMove({ id: 2, move: 'a10a9' }),
    ];
    expect(positions(currentState, action)).toEqual(expectedNewState);
  });

  it.skip('should update the given position', () => {
    const action = { type: 'GAME/POSITIONS/UPDATE', id: 1 };

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

  test('select last move', () => {
    const state = [
      { id: 0, move: null },
      { id: 2, move: 'a1a2' },
      { id: 3, move: 'a10a9' },
    ];
    expect(getLastMove(state)).toEqual({ id: 3, move: 'a10a9' });
  });
});
