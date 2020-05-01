import actions from 'actions';
import reducer from 'reducers';

describe('game slug reducer', () => {
  const table = [
    [
      'return the default state',
      {
        action: {},
        field: 'gameSlug',
        currentState: undefined,
        expectedNewState: null,
      },
    ],
    [
      'set the game slug',
      {
        action: actions.game.slug.set('ABC123'),
        field: 'gameSlug',
        currentState: null,
        expectedNewState: 'ABC123',
      },
    ],
  ];

  test.each(table)('%s', (name, data) => {
    const { action, field, currentState, expectedNewState } = data;
    const result = reducer({ [field]: currentState }, action)[field];
    expect(result).toStrictEqual(expectedNewState);
  });
});
