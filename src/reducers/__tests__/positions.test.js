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

describe('position reducers', () => {
  test.each([
    ['return the default state', {}, undefined, []],
    [
      'add the first position with id = 0',
      actions.game.positions.add({}),
      [],
      [createPosition({ id: 0 })],
    ],
    [
      'add a position with an incremented id',
      actions.game.positions.add({}),
      [createPosition({ id: 0 })],
      [createPosition({ id: 0 }), createPosition({ id: 1 })],
    ],
    [
      'remove a position',
      actions.game.positions.remove(1),
      [
        createPosition({ id: 0, move: null }),
        createPosition({ id: 1, move: 'a1a2' }),
        createPosition({ id: 2, move: 'a10a9' }),
      ],
      [
        createPosition({ id: 0, move: null }),
        createPosition({ id: 2, move: 'a10a9' }),
      ],
    ],
    [
      'update a position',
      actions.game.positions.update({ id: 1, move: 'b1a3' }),
      [
        createPosition({ id: 0, givesCheck: false, move: null }),
        createPosition({ id: 1, givesCheck: false, move: 'a1a2' }),
        createPosition({ id: 2, givesCheck: false, move: 'a10a9' }),
      ],
      [
        createPosition({ id: 0, givesCheck: false, move: null }),
        createPosition({ id: 1, givesCheck: false, move: 'b1a3' }),
        createPosition({ id: 2, givesCheck: false, move: 'a10a9' }),
      ],
    ],
    [
      'set positions from the payload',
      actions.game.positions.set([{ move: null }, { move: 'b1a3' }]),
      [
        createPosition({ id: 0, move: null }),
        createPosition({ id: 1, move: 'a1a2' }),
        createPosition({ id: 2, move: 'a10a9' }),
      ],
      [
        createPosition({ id: 0, move: null }),
        createPosition({ id: 1, move: 'b1a3' }),
      ],
    ],
  ])('%s', (_, action, currentState, expectedNewState) => {
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
