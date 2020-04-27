import actions, { addPosition } from 'actions';

test('add position', () => {
  expect(addPosition({})).toStrictEqual({ type: 'add_position' });
});

test('add game position', () => {
  expect(actions.game.positions.add({})).toStrictEqual({
    type: 'GAME/POSITIONS/ADD',
    payload: {},
  });
});
