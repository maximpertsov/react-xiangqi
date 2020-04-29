import makeMove from 'actions/makeMove';

test('make a move', async () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});

  await store.dispatch(makeMove({ move: 'a1a2' }));

  expect(store.getActions()).toEqual([
    { type: 'GAME/POSITIONS/ADD', payload: { move: 'a1a2' } },
    { type: 'select_move', moveId: null },
    { type: 'toggle_show_confirm_move_menu', value: true },
  ]);
});
