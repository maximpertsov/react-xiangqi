import actions from 'actions';
import reducer from 'reducers/showConfirmMoveMenu';

describe('showConfirmMoveMenu reducer', () => {
  const table = [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: false,
      },
    ],
    [
      'toggle showing the confirm move menu ',
      {
        action: actions.game.showConfirmMoveMenu.set(true),
        currentState: false,
        expectedNewState: true,
      },
    ],
  ];

  test.each(table)('%s', (name, data) => {
    const { action, currentState, expectedNewState } = data;
    expect(reducer(currentState, action)).toStrictEqual(expectedNewState);
  });
});
