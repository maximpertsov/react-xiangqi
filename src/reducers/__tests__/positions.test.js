import actions from 'actions';
import reducer, { getLastMove, getMoveById } from 'reducers/positions';

const createPosition = (properties = {}) => ({
  id: undefined,
  fen: undefined,
  givesCheck: undefined,
  legalMoves: undefined,
  fan: undefined,
  ...properties,
});

describe('position reducers', () => {
  const table = [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: [],
      },
    ],
    [
      'add the first position with id = 0',
      {
        action: actions.game.positions.add({}),
        currentState: [],
        expectedNewState: [createPosition({ id: 0 })],
      },
    ],
    [
      'add a position with an incremented id',
      {
        action: actions.game.positions.add({}),
        currentState: [createPosition({ id: 0 })],
        expectedNewState: [
          createPosition({ id: 0 }),
          createPosition({ id: 1 }),
        ],
      },
    ],
    [
      'remove a position',
      {
        action: actions.game.positions.remove(1),
        currentState: [
          createPosition({ id: 0, fan: null }),
          createPosition({ id: 1, fan: 'a1a2' }),
          createPosition({ id: 2, fan: 'a10a9' }),
        ],
        expectedNewState: [
          createPosition({ id: 0, fan: null }),
          createPosition({ id: 2, fan: 'a10a9' }),
        ],
      },
    ],
    [
      'update a position',
      {
        action: actions.game.positions.update({ id: 1, fan: 'b1a3' }),
        currentState: [
          createPosition({ id: 0, givesCheck: false, fan: null }),
          createPosition({ id: 1, givesCheck: false, fan: 'a1a2' }),
          createPosition({ id: 2, givesCheck: false, fan: 'a10a9' }),
        ],
        expectedNewState: [
          createPosition({ id: 0, givesCheck: false, fan: null }),
          createPosition({ id: 1, givesCheck: false, fan: 'b1a3' }),
          createPosition({ id: 2, givesCheck: false, fan: 'a10a9' }),
        ],
      },
    ],
    [
      'set positions from the payload',
      {
        action: actions.game.positions.set([{ fan: null }, { fan: 'b1a3' }]),
        currentState: [
          createPosition({ id: 0, fan: null }),
          createPosition({ id: 1, fan: 'a1a2' }),
          createPosition({ id: 2, fan: 'a10a9' }),
        ],
        expectedNewState: [
          createPosition({ id: 0, fan: null }),
          createPosition({ id: 1, fan: 'b1a3' }),
        ],
      },
    ],
  ];

  test.each(table)('%s', (name, data) => {
    const { action, currentState, expectedNewState } = data;
    expect(reducer(currentState, action)).toStrictEqual(expectedNewState);
  });
});

describe('positions selectors', () => {
  test('select move by id', () => {
    const state = [
      { id: 0, fan: null },
      { id: 2, fan: 'a1a2' },
      { id: 3, fan: 'a10a9' },
    ];
    expect(getMoveById(state, 0)).toStrictEqual({ id: 0, fan: null });
    expect(getMoveById(state, 1)).toStrictEqual(undefined);
    expect(getMoveById(state, 2)).toStrictEqual({ id: 2, fan: 'a1a2' });
    expect(getMoveById(state, 3)).toStrictEqual({ id: 3, fan: 'a10a9' });
  });

  test('select last move', () => {
    const state = [
      { id: 0, fan: null },
      { id: 2, fan: 'a1a2' },
      { id: 3, fan: 'a10a9' },
    ];
    expect(getLastMove(state)).toStrictEqual({ id: 3, fan: 'a10a9' });
  });
});
