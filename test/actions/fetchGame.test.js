import axios from 'axios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetchGame from 'actions/fetchGame';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetch game', () => {
  const store = mockStore({});

  test('do nothing if the game slug is null', async () => {
    await store.dispatch(fetchGame({ gameSlug: null }));

    expect(store.getActions()).toEqual([]);
  });

  test('fetch game if slug is provided', async () => {
    jest.mock('axios');
    axios.get = jest.fn(() =>
      Promise.resolve({
        data: {
          players: [],
        },
      }),
    );

    const gameSlug = 'ABC123';
    await store.dispatch(fetchGame({ gameSlug }));
    expect(axios.get).toHaveBeenCalledWith(`game/${gameSlug}`);
    expect(store.getActions()).toEqual([{ type: 'set_players', players: [] }]);
  });
});
