import get from 'lodash/get';
import set from 'lodash/set';
import toPairs from 'lodash/toPairs';

import actions from 'actions';
import reducer from 'reducers';

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
      'set auto move both teams',
      {
        action: actions.home.autoMove.set.both(),
        currentState: [],
        expectedNewState: ['red', 'black'],
      },
    ],
  ],
  canMoveBothTeams: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: false,
      },
    ],
    [
      'toggle can move both teams',
      {
        action: actions.game.canMoveBothTeams.set(true),
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
        action: actions.home.games.set([{ slug: 'ABC123' }]),
        currentState: null,
        expectedNewState: [{ slug: 'ABC123' }],
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
  ['loginForm.username']: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: '',
      },
    ],
    [
      'set the login form username',
      {
        action: actions.home.loginForm.username.set('user123'),
        currentState: '',
        expectedNewState: 'user123',
      },
    ],
  ],
  ['loginForm.password']: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: '',
      },
    ],
    [
      'set the login form password',
      {
        action: actions.home.loginForm.password.set('pass123'),
        currentState: '',
        expectedNewState: 'pass123',
      },
    ],
  ],
  ['loginForm.error']: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: '',
      },
    ],
    [
      'set the login form error',
      {
        action: actions.home.loginForm.error.set('failed!'),
        currentState: '',
        expectedNewState: 'failed!',
      },
    ],
  ],
  ['loginForm.loading']: [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: true,
      },
    ],
    [
      'set the login form loading',
      {
        action: actions.home.loginForm.loading.set(false),
        currentState: true,
        expectedNewState: false,
      },
    ],
  ],
  selectedFen: [
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
        action: actions.game.selectedFen.set('FEN'),
        currentState: null,
        expectedNewState: 'FEN',
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

describe.each(toPairs(tables))('%s reducer', (key, table) => {
  test.each(table)('%s', (name, data) => {
    const { action, currentState, expectedNewState } = data;

    const globalState = {};
    set(globalState, key, currentState);
    const result = get(reducer(globalState, action), key);
    expect(result).toStrictEqual(expectedNewState);
  });
});
