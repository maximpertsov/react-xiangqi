import axios from 'axios';
import actions from 'actions';
import fetchUserGames from 'actions/fetchUserGames';

jest.mock('axios');

describe('fetch user games', () => {
  const store = mockStore({});

  test('do nothing if the username is null', async () => {
    await store.dispatch(fetchUserGames({ username: null }));

    expect(axios.get).not.toHaveBeenCalled();
    expect(store.getActions()).toStrictEqual([]);
  });

  test('fetch game if slug is provided', async () => {
    axios.get.mockResolvedValue({
      data: {
        games: [{ slug: 'ABC123' }],
      },
    });

    await store.dispatch(fetchUserGames({ username: 'user123' }));

    expect(axios.get).toHaveBeenCalledWith('player/user123/games');
    expect(store.getActions()).toStrictEqual([
      actions.home.games.set([{ slug: 'ABC123' }]),
    ]);
  });
});
