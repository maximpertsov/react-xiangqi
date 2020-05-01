import reducer from 'reducers';

describe('animation offset reducer', () => {
  const a1 = 0;
  const b2 = 10;

  const table = [
    [
      'return the default state',
      {
        action: {},
        currentState: undefined,
        expectedNewState: [0, 0],
      },
    ],
    [
      'set the animation offset red is at bottom',
      {
        action: {
          type: 'set_animation_offset',
          bottomPlayerIsRed: true,
          fromSlot: a1,
          toSlot: b2,
        },
        currentState: [0, 0],
        expectedNewState: [1, 1],
      },
    ],
    [
      'set the animation offset black is at bottom',
      {
        action: {
          type: 'set_animation_offset',
          bottomPlayerIsRed: false,
          fromSlot: a1,
          toSlot: b2,
        },
        currentState: [0, 0],
        expectedNewState: [-1, -1],
      },
    ],
    [
      'clear the animation offset',
      {
        action: {
          type: 'clear_animation_offset',
        },
        currentState: undefined,
        expectedNewState: [0, 0],
      },
    ],
  ];

  test.each(table)('%s', (_, data) => {
    const { action, currentState, expectedNewState } = data;
    const stateField = 'animationOffset';
    const result = reducer({ [stateField]: currentState }, action)[stateField];
    expect(result).toStrictEqual(expectedNewState);
  });
});
