import axios from 'axios';
import actions from 'actions';
import fetchPosition from 'actions/fetchPosition';

jest.mock('axios');

test('fetch position', async () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});
  axios.post.mockResolvedValue({
    data: { fen: 'FEN', legalMoves: {}, givesCheck: false },
  });

  await store.dispatch(fetchPosition({ fen: 'FEN', id: 1, fan: 'a1a2' }));

  expect(axios.post).toHaveBeenCalledWith('fen', { fen: 'FEN' });
  expect(store.getActions()).toStrictEqual([
    actions.game.positions.update({
      id: 1,
      fan: 'a1a2',
      fen: 'FEN',
      legalMoves: {},
      givesCheck: false,
    }),
  ]);
});
