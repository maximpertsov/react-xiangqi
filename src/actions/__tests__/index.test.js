import actions from 'actions';

test('add game position', () => {
  expect(actions.game.positions.add({})).toStrictEqual({
    type: 'GAME/POSITIONS/ADD',
    payload: {},
  });
});
