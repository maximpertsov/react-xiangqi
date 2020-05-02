import actions from 'actions';
import reducer from 'reducers';
import toPairs from 'lodash/toPairs';

const tables = {
  animationOffset: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: [0, 0],
      },
    ],
    [
      'set the animation offset',
      {
        action: actions.board.animationOffset.set([1, 1]),
        currentState: [0, 0],
        expectedNewState: [1, 1],
      },
    ],
    [
      'clear the animation offset',
      {
        action: actions.board.animationOffset.clear(),
        currentState: undefined,
        expectedNewState: [0, 0],
      },
    ],
  ],
  autoMove: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: [],
      },
    ],
    [
      'set auto move off',
      {
        action: actions.home.autoMove.set.off(),
        currentState: [],
        expectedNewState: [],
      },
    ],
    [
      'set auto move red',
      {
        action: actions.home.autoMove.set.red(),
        currentState: [],
        expectedNewState: ['red'],
      },
    ],
    [
      'set auto move black',
      {
        action: actions.home.autoMove.set.black(),
        currentState: [],
        expectedNewState: ['black'],
      },
    ],
    [
      'set auto move both colors',
      {
        action: actions.home.autoMove.set.both(),
        currentState: [],
        expectedNewState: ['red', 'black'],
      },
    ],
  ],
  canMoveBothColors: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: false,
      },
    ],
    [
      'toggle can move both colors',
      {
        action: actions.game.canMoveBothColors.set(true),
        currentState: false,
        expectedNewState: true,
      },
    ],
  ],
  games: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: [],
      },
    ],
    [
      'set games',
      {
        action: { type: 'set_games', games: [] },
        currentState: null,
        expectedNewState: [],
      },
    ],
  ],
  gameSlug: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: null,
      },
    ],
    [
      'set the game slug',
      {
        action: actions.game.slug.set('ABC123'),
        currentState: null,
        expectedNewState: 'ABC123',
      },
    ],
  ],
  requestedTakeback: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: false,
      },
    ],
    [
      'toggle requested takeback',
      {
        action: actions.game.requestedTakeback.set(true),
        currentState: false,
        expectedNewState: true,
      },
    ],
  ],
  selectedMoveId: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: null,
      },
    ],
    [
      'sets the selected move',
      {
        action: actions.game.selectedPosition.set(1),
        currentState: null,
        expectedNewState: 1,
      },
    ],
  ],
  selectedSquare: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: null,
      },
    ],
    [
      'set the selected square',
      {
        action: actions.board.selectedSquare.set('a1a2'),
        currentState: null,
        expectedNewState: 'a1a2',
      },
    ],
  ],
  showConfirmMoveMenu: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: false,
      },
    ],
    [
      'toggle showing the confirm move menu',
      {
        action: actions.game.showConfirmMoveMenu.set(true),
        currentState: false,
        expectedNewState: true,
      },
    ],
  ],
  showGame: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: false,
      },
    ],
    [
      'toggle show game',
      {
        action: actions.home.showGame.set(true),
        currentState: false,
        expectedNewState: true,
      },
    ],
  ],
  updateCount: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: -1,
      },
    ],
    [
      'set the update count',
      {
        action: actions.game.updateCount.set(3),
        currentState: -1,
        expectedNewState: 3,
      },
    ],
  ],
  username: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: null,
      },
    ],
    [
      'set the username',
      {
        action: actions.home.username.set('user'),
        currentState: null,
        expectedNewState: 'user',
      },
    ],
  ],
};

describe.each(toPairs(tables))('%s reducer', (stateField, table) => {
  test.each(table)('%s', (name, data) => {
    const { action, currentState, expectedNewState } = data;
    const result = reducer({ [stateField]: currentState }, action)[stateField];
    expect(result).toStrictEqual(expectedNewState);
  });
});
