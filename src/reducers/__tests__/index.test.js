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
};

describe.each(toPairs(tables))('%s reducer', (stateField, table) => {
  test.each(table)('%s', (name, data) => {
    const { action, currentState, expectedNewState } = data;
    const result = reducer({ [stateField]: currentState }, action)[stateField];
    expect(result).toStrictEqual(expectedNewState);
  });
});
