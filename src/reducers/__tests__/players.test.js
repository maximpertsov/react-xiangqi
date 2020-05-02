import actions from 'actions';
import reducer from 'reducers/players';

describe('player reducer', () => {
  const table = [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: [
          { name: undefined, color: 'red' },
          { name: undefined, color: 'black' },
        ],
      },
    ],
    [
      'set the players',
      {
        action: actions.game.players.set([
          { name: 'alice', color: 'red' },
          { name: 'bob', color: 'black' },
        ]),
        currentState: null,
        expectedNewState: [
          { name: 'alice', color: 'red' },
          { name: 'bob', color: 'black' },
        ],
      },
    ],
  ];

  test.each(table)('%s', (name, data) => {
    const { action, currentState, expectedNewState } = data;
    expect(reducer(currentState, action)).toStrictEqual(expectedNewState);
  });
});
