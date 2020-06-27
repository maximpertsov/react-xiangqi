import axios from 'axios';
import actions from 'actions';
import fetchStartingPosition from 'actions/fetchStartingPosition';

jest.mock('axios');

test('fetch starting move', async () => {
  const store = mockStore({});
  axios.post.mockResolvedValue({ data: { fen: 'FEN0' } });

  await store.dispatch(fetchStartingPosition());

  expect(axios.post).toHaveBeenCalledWith('starting-position');
  expect(store.getActions()).toStrictEqual([
    actions.game.selectedFen.set('FEN0'),
    actions.game.moves.add({ fen: 'FEN0', uci: null }),
  ]);
});
