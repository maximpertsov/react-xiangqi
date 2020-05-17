import actions from 'actions';
import makeMove from 'actions/makeMove';

test('make a move', async () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});

  await store.dispatch(makeMove({ fan: 'a1a2' }));

  expect(store.getActions()).toStrictEqual([
    actions.game.moves.add({ fan: 'a1a2' }),
    actions.game.selectedMove.set(null),
    actions.game.showConfirmMoveMenu.set(true),
  ]);
});
