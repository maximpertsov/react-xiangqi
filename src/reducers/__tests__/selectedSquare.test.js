import actions from 'actions';
import reducer from 'reducers/selectedSquare';

describe('selected square reducers', () => {
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
      'set the selected square',
      {
        action: actions.board.selectedSquare.set('a1a2'),
        currentState: null,
        expectedNewState: 'a1a2',
      },
    ],
  ];

  test.each(table)('%s', (name, data) => {
    const { action, currentState, expectedNewState } = data;
    expect(reducer(currentState, action)).toStrictEqual(expectedNewState);
  });
});
