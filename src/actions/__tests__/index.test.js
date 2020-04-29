import actions from 'actions';

test('add game position', () => {
  expect(actions.game.positions.add({})).toStrictEqual({
    type: 'GAME/POSITIONS/ADD',
    payload: {},
  });
});

test('update game position', () => {
  expect(actions.game.positions.update({})).toStrictEqual({
    type: 'GAME/POSITIONS/UPDATE',
    payload: {},
  });
});

test('select move', () => {
  expect(actions.game.selectedPosition.set(0)).toStrictEqual({
    type: 'GAME/SELECTED_POSITION/SET',
    payload: 0,
  });
});
