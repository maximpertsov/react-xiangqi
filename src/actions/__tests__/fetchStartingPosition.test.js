import axios from 'axios';
import actions from 'actions';
import fetchStartingPosition from 'actions/fetchStartingPosition';

jest.mock('axios');

test('fetch starting move', async () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});
  axios.get.mockResolvedValue({ data: {} });

  await store.dispatch(fetchStartingPosition());

  expect(axios.get).toHaveBeenCalledWith('fen');
  expect(store.getActions()).toStrictEqual([
    actions.game.moves.add({ fan: null }),
  ]);
});
