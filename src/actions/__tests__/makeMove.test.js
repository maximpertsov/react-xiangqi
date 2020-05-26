import actions from 'actions';
import makeMove from 'actions/makeMove';

test('make a move', async () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});

  await store.dispatch(makeMove({ uci: 'a1a2' }));

  expect(store.getActions()).toStrictEqual([
    actions.game.moves.add({ uci: 'a1a2' }),
    actions.game.selectedFen.set(null),
    actions.game.showConfirmMoveMenu.set(true),
  ]);
});
