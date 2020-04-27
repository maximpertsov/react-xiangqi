import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import makeMove from 'actions/makeMove';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test('make a move', async () => {
  const store = mockStore({});

  await store.dispatch(makeMove({ move: 'a1a2' }));

  expect(store.getActions()).toEqual([
    { type: 'GAME/POSITIONS/ADD', payload: { move: 'a1a2' } },
    { type: 'select_move', moveId: null },
    { type: 'toggle_show_confirm_move_menu', value: true },
  ]);
});
