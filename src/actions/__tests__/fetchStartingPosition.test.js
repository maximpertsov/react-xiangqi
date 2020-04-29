import axios from 'axios';
import fetchStartingPosition from 'actions/fetchStartingPosition';

jest.mock('axios');

test('fetch starting position', async () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});
  axios.get.mockResolvedValue({ data: {} });

  await store.dispatch(fetchStartingPosition());

  expect(axios.get).toHaveBeenCalledWith('fen');
  expect(store.getActions()).toEqual([
    { type: 'GAME/POSITIONS/ADD', payload: { move: null } },
  ]);
});
