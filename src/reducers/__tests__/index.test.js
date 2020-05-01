import actions from 'actions';
import reducer from 'reducers';
import toPairs from 'lodash/toPairs';

const tables = {
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
};

describe.each(toPairs(tables))('%s reducer', (stateField, table) => {
  test.each(table)('%s', (name, data) => {
    const { action, currentState, expectedNewState } = data;
    const result = reducer({ [stateField]: currentState }, action)[stateField];
    expect(result).toStrictEqual(expectedNewState);
  });
});
