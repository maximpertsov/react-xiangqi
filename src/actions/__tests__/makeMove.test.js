import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import makeMove from 'actions/makeMove';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test('make a move', async () => {
  const store = mockStore({});

  await store.dispatch(makeMove({ move: 'a1a2' }));

  expect(store.getActions()).toEqual([
    { type: 'add_position', move: 'a1a2' },
    { type: 'select_move', moveId: null },
  ]);
});
