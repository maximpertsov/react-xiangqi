import 'regenerator-runtime/runtime';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetchGame from 'actions/fetchGame';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

Enzyme.configure({ adapter: new Adapter() });

describe('fetch game', () => {
  const store = mockStore({});

  test('do nothing if the game slug is null', async () => {
    await store.dispatch(fetchGame({ gameSlug: null }));

    expect(store.getActions()).toEqual([]);
  });
});
