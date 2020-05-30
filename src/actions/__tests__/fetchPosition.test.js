import axios from 'axios';
import actions from 'actions';
import fetchPosition from 'actions/fetchPosition';

jest.mock('axios');

test('fetch move', async () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});
  axios.post.mockResolvedValue({
    data: { fen: 'FEN', legalMoves: {}, givesCheck: false },
  });

  await store.dispatch(fetchPosition({ fen: 'FEN' }));

  expect(axios.post).toHaveBeenCalledWith('position', { fen: 'FEN' });
  expect(store.getActions()).toStrictEqual([
    actions.game.moves.update({
      fen: 'FEN',
      legalMoves: {},
      givesCheck: false,
    }),
  ]);
});
