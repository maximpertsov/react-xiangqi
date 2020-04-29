import axios from 'axios';
import fetchGame from 'actions/fetchGame';

jest.mock('axios');

describe('fetch game', () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});

  test('do nothing if the game slug is null', async () => {
    await store.dispatch(fetchGame({ gameSlug: null }));

    expect(axios.get).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });

  test('fetch game if slug is provided', async () => {
    axios.get.mockResolvedValue({
      data: {
        players: [],
        moves: [{}, {}],
      },
    });

    await store.dispatch(fetchGame({ gameSlug: 'ABC123' }));

    expect(axios.get).toHaveBeenCalledWith('game/ABC123');
    expect(store.getActions()).toEqual([
      { type: 'set_players', players: [] },
      {
        type: 'set_moves',
        moves: [{}, {}],
      },
      { type: 'select_move', moveId: 1 },
    ]);
  });
});
