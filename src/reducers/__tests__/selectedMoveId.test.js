import actions from 'actions';
import reducer from 'reducers/selectedMoveId';

describe('selected move reducers', () => {
  const table = [
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
        currentState: [],
        expectedNewState: 1,
      },
    ],
  ];

  test.each(table)('%s', (name, data) => {
    const { action, currentState, expectedNewState } = data;
    expect(reducer(currentState, action)).toStrictEqual(expectedNewState);
  });
});
