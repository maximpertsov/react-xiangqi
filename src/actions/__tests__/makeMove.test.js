import actions from 'actions';
import makeMove from 'actions/makeMove';

test('make a move', async () => {
  const store = mockStore({});

  await store.dispatch(makeMove({ fen: 'FEN1', uci: 'a1a2' }));

  expect(store.getActions()).toStrictEqual([
    actions.game.moves.add({ fen: 'FEN1', uci: 'a1a2' }),
    actions.game.selectedFen.set('FEN1'),
    actions.game.showConfirmMoveMenu.set(true),
  ]);
});
