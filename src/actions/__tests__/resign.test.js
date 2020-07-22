import resign from 'actions/resign';
import axios from 'axios';

jest.mock('axios');

describe('resign', () => {
  const store = mockStore({});
  const io = { send: jest.fn() };

  afterEach(() => {
    store.clearActions();
  });

  test('request', async () => {
    axios.post.mockResolvedValue({});

    await store.dispatch(
      resign.send({ io, gameSlug: 'ABC123', username: 'user1' }),
    );
    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'resigned',
      payload: { username: 'user1' },
    });
    expect(io.send).toHaveBeenCalledWith('resigned', {
      gameSlug: 'ABC123',
      username: 'user1',
    });
  });
});
