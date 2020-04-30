import actions from 'actions';
import positions, { getLastMove, getMoveById } from 'reducers/positions';

const createPosition = (properties = {}) => ({
  id: undefined,
  fen: undefined,
  givesCheck: undefined,
  legalMoves: undefined,
  move: undefined,
  ...properties,
});

describe('positions reducer', () => {
  it('should return the default state', () => {
    expect(positions(undefined, {})).toStrictEqual([]);
  });

  describe('add position', () => {
    const action = actions.game.positions.add({});

    it('should add the first position with id = 0', () => {
      const currentState = [];
      const expectedNewState = [createPosition({ id: 0 })];
      expect(positions(currentState, action)).toStrictEqual(expectedNewState);
    });

    it('should add a position with an incremented id', () => {
      const currentState = [createPosition({ id: 0 })];
      const expectedNewState = [
        createPosition({ id: 0 }),
        createPosition({ id: 1 }),
      ];
      expect(positions(currentState, action)).toStrictEqual(expectedNewState);
    });
  });

  it('should remove given position', () => {
    const action = actions.game.positions.remove(1);

    const currentState = [
      createPosition({ id: 0, move: null }),
      createPosition({ id: 1, move: 'a1a2' }),
      createPosition({ id: 2, move: 'a10a9' }),
    ];
    const expectedNewState = [
      createPosition({ id: 0, move: null }),
      createPosition({ id: 2, move: 'a10a9' }),
    ];
    expect(positions(currentState, action)).toStrictEqual(expectedNewState);
  });

  it('should update the given position', () => {
    const action = actions.game.positions.update({ id: 1, move: 'b1a3' });

    const currentState = [
      createPosition({ id: 0, givesCheck: false, move: null }),
      createPosition({ id: 1, givesCheck: false, move: 'a1a2' }),
      createPosition({ id: 2, givesCheck: false, move: 'a10a9' }),
    ];
    const expectedNewState = [
      createPosition({ id: 0, givesCheck: false, move: null }),
      createPosition({ id: 1, givesCheck: false, move: 'b1a3' }),
      createPosition({ id: 2, givesCheck: false, move: 'a10a9' }),
    ];
    expect(positions(currentState, action)).toStrictEqual(expectedNewState);
  });

  it('should set positions from the payload', () => {
    const action = actions.game.positions.set([
      { move: null },
      { move: 'b1a3' },
    ]);

    const currentState = [
      createPosition({ id: 0, move: null }),
      createPosition({ id: 1, move: 'a1a2' }),
      createPosition({ id: 2, move: 'a10a9' }),
    ];
    const expectedNewState = [
      createPosition({ id: 0, move: null }),
      createPosition({ id: 1, move: 'b1a3' }),
    ];
    expect(positions(currentState, action)).toStrictEqual(expectedNewState);
  });
});

describe('positions selectors', () => {
  test('select move by id', () => {
    const state = [
      { id: 0, move: null },
      { id: 2, move: 'a1a2' },
      { id: 3, move: 'a10a9' },
    ];
    expect(getMoveById(state, 0)).toStrictEqual({ id: 0, move: null });
    expect(getMoveById(state, 1)).toStrictEqual(undefined);
    expect(getMoveById(state, 2)).toStrictEqual({ id: 2, move: 'a1a2' });
    expect(getMoveById(state, 3)).toStrictEqual({ id: 3, move: 'a10a9' });
  });

  test('select last move', () => {
    const state = [
      { id: 0, move: null },
      { id: 2, move: 'a1a2' },
      { id: 3, move: 'a10a9' },
    ];
    expect(getLastMove(state)).toStrictEqual({ id: 3, move: 'a10a9' });
  });
});
