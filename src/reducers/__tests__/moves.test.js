import actions from 'actions';
import reducer, { getLastMove, getMoveById } from 'reducers/moves';

const createMove = (properties = {}) => ({
  id: undefined,
  gameResult: undefined,
  fen: undefined,
  givesCheck: undefined,
  legalMoves: undefined,
  uci: undefined,
  ...properties,
});

describe('move reducers', () => {
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
      'add the first move with id = 0',
      {
        action: actions.game.moves.add({}),
        currentState: [],
        expectedNewState: [createMove({ id: 0 })],
      },
    ],
    [
      'add a move with an incremented id',
      {
        action: actions.game.moves.add({}),
        currentState: [createMove({ id: 0 })],
        expectedNewState: [
          createMove({ id: 0 }),
          createMove({ id: 1 }),
        ],
      },
    ],
    [
      'remove a move',
      {
        action: actions.game.moves.remove(1),
        currentState: [
          createMove({ id: 0, uci: null }),
          createMove({ id: 1, uci: 'a1a2' }),
          createMove({ id: 2, uci: 'a10a9' }),
        ],
        expectedNewState: [
          createMove({ id: 0, uci: null }),
          createMove({ id: 2, uci: 'a10a9' }),
        ],
      },
    ],
    [
      'update a move',
      {
        action: actions.game.moves.update({ id: 1, uci: 'b1a3' }),
        currentState: [
          createMove({ id: 0, givesCheck: false, uci: null }),
          createMove({ id: 1, givesCheck: false, uci: 'a1a2' }),
          createMove({ id: 2, givesCheck: false, uci: 'a10a9' }),
        ],
        expectedNewState: [
          createMove({ id: 0, givesCheck: false, uci: null }),
          createMove({ id: 1, givesCheck: false, uci: 'b1a3' }),
          createMove({ id: 2, givesCheck: false, uci: 'a10a9' }),
        ],
      },
    ],
    [
      'set moves from the payload',
      {
        action: actions.game.moves.set([{ uci: null }, { uci: 'b1a3' }]),
        currentState: [
          createMove({ id: 0, uci: null }),
          createMove({ id: 1, uci: 'a1a2' }),
          createMove({ id: 2, uci: 'a10a9' }),
        ],
        expectedNewState: [
          createMove({ id: 0, uci: null }),
          createMove({ id: 1, uci: 'b1a3' }),
        ],
      },
    ],
  ];

  test.each(table)('%s', (name, data) => {
    const { action, currentState, expectedNewState } = data;
    expect(reducer(currentState, action)).toStrictEqual(expectedNewState);
  });
});

describe('moves selectors', () => {
  test('select move by id', () => {
    const state = [
      { id: 0, uci: null },
      { id: 2, uci: 'a1a2' },
      { id: 3, uci: 'a10a9' },
    ];
    expect(getMoveById(state, 0)).toStrictEqual({ id: 0, uci: null });
    expect(getMoveById(state, 1)).toStrictEqual(undefined);
    expect(getMoveById(state, 2)).toStrictEqual({ id: 2, uci: 'a1a2' });
    expect(getMoveById(state, 3)).toStrictEqual({ id: 3, uci: 'a10a9' });
  });

  test('select last move', () => {
    const state = [
      { id: 0, uci: null },
      { id: 2, uci: 'a1a2' },
      { id: 3, uci: 'a10a9' },
    ];
    expect(getLastMove(state)).toStrictEqual({ id: 3, uci: 'a10a9' });
  });
});
