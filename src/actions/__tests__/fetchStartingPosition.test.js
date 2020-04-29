import axios from 'axios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetchStartingPosition from 'actions/fetchStartingPosition';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('axios');

test('fetch starting position', async () => {
  const store = mockStore({});
  axios.get.mockResolvedValue({ data: {} });

  await store.dispatch(fetchStartingPosition());

  expect(axios.get).toHaveBeenCalledWith('fen');
  expect(store.getActions()).toEqual([
    { type: 'GAME/POSITIONS/ADD', payload: { move: null } },
  ]);
});
