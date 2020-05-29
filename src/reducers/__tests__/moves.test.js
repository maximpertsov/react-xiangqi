import actions from 'actions';
import reducer, {
  getHasInitialPlacement,
  getLastMove,
  getMoveByFen,
} from 'reducers/moves';

jest.mock('services/logic/fen');

const createMove = (properties = {}) => ({
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
      'add the first move',
      {
        action: actions.game.moves.add({ fen: 'FEN0' }),
        currentState: [],
        expectedNewState: [createMove({ fen: 'FEN0' })],
      },
    ],
    [
      'add the second move',
      {
        action: actions.game.moves.add({ fen: 'FEN1' }),
        currentState: [createMove({ fen: 'FEN0' })],
        expectedNewState: [
          createMove({ fen: 'FEN0' }),
          createMove({ fen: 'FEN1' }),
        ],
      },
    ],
    [
      'remove a move',
      {
        action: actions.game.moves.remove('FEN1'),
        currentState: [
          createMove({ fen: 'FEN0', uci: null }),
          createMove({ fen: 'FEN1', uci: 'a1a2' }),
          createMove({ fen: 'FEN2', uci: 'a10a9' }),
        ],
        expectedNewState: [
          createMove({ fen: 'FEN0', uci: null }),
          createMove({ fen: 'FEN2', uci: 'a10a9' }),
        ],
      },
    ],
    [
      'update a move',
      {
        action: actions.game.moves.update({ fen: 'FEN1', uci: 'b1a3' }),
        currentState: [
          createMove({ fen: 'FEN0', givesCheck: false, uci: null }),
          createMove({ fen: 'FEN1', givesCheck: false, uci: 'a1a2' }),
          createMove({ fen: 'FEN2', givesCheck: false, uci: 'a10a9' }),
        ],
        expectedNewState: [
          createMove({ fen: 'FEN0', givesCheck: false, uci: null }),
          createMove({ fen: 'FEN1', givesCheck: false, uci: 'b1a3' }),
          createMove({ fen: 'FEN2', givesCheck: false, uci: 'a10a9' }),
        ],
      },
    ],
    [
      'set moves from the payload',
      {
        action: actions.game.moves.set([{ uci: null }, { uci: 'b1a3' }]),
        currentState: [
          createMove({ uci: null }),
          createMove({ uci: 'a1a2' }),
          createMove({ uci: 'a10a9' }),
        ],
        expectedNewState: [
          createMove({ uci: null }),
          createMove({ uci: 'b1a3' }),
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
  test('select move by fen', () => {
    const state = [
      { fen: 'FEN0', uci: null },
      { fen: 'FEN2', uci: 'a1a2' },
      { fen: 'FEN3', uci: 'a10a9' },
    ];
    /* eslint-disable max-len */
    // prettier-ignore
    expect(getMoveByFen(state, 'FEN0')).toStrictEqual({ fen: 'FEN0', uci: null });
    // prettier-ignore
    expect(getMoveByFen(state, 'FEN1')).toStrictEqual(undefined);
    // prettier-ignore
    expect(getMoveByFen(state, 'FEN2')).toStrictEqual({ fen: 'FEN2', uci: 'a1a2' });
    // prettier-ignore
    expect(getMoveByFen(state, 'FEN3')).toStrictEqual({ fen: 'FEN3', uci: 'a10a9' });
    /* eslint-enable max-len */
  });

  test('select last move', () => {
    const state = [
      { fen: 'FEN0', uci: null },
      { fen: 'FEN3', uci: 'a10a9' },
      { fen: 'FEN2', uci: 'a1a2' },
    ];
    expect(getLastMove(state)).toStrictEqual({ fen: 'FEN3', uci: 'a10a9' });
  });

  test('has initial placement', () => {
    const state = [{ fen: 'FEN0', uci: null }];
    expect(getHasInitialPlacement(state)).toBe(true);
  });

  test('no initial placement', () => {
    const state = [{ uci: null }];
    expect(getHasInitialPlacement(state)).toBe(false);
  });

  test('no initial move', () => {
    const state = [];
    expect(getHasInitialPlacement(state)).toBe(false);
  });
});
