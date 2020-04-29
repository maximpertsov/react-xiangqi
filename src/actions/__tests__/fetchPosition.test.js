import axios from 'axios';
import fetchPosition from 'actions/fetchPosition';

jest.mock('axios');

test('fetch position', async () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});
  axios.post.mockResolvedValue({
    data: { fen: 'FEN', legalMoves: {}, givesCheck: false },
  });

  await store.dispatch(fetchPosition({ fen: 'FEN', id: 1, move: 'a1a2' }));

  expect(axios.post).toHaveBeenCalledWith('fen', { fen: 'FEN' });
  expect(store.getActions()).toEqual([
    {
      type: 'GAME/POSITIONS/UPDATE',
      payload: {
        id: 1,
        move: 'a1a2',
        fen: 'FEN',
        legalMoves: {},
        givesCheck: false,
      },
    },
  ]);
});
