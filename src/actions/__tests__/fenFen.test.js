import axios from 'axios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { fetchInitialPosition } from 'actions/fetchFen';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('axios');

describe('fetch position data', () => {
  const store = mockStore({});

  test('fetchInitialPosition', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: {},
    });
    await store.dispatch(fetchInitialPosition());

    expect(store.getActions()).toEqual([
      { type: 'GAME/POSITIONS/ADD', payload: { move: null } },
    ]);
  });
});
