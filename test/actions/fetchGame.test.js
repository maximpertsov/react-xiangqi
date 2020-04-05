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
          moves: [{}, {}],
        },
      }),
    );

    const gameSlug = 'ABC123';
    await store.dispatch(fetchGame({ gameSlug }));
    expect(axios.get).toHaveBeenCalledWith(`game/${gameSlug}`);

    const moveData = {
      fen: undefined,
      givesCheck: undefined,
      legalMoves: undefined,
      move: undefined,
      pending: false,
    };
    expect(store.getActions()).toEqual([
      { type: 'set_players', players: [] },
      { type: 'add_move', moveId: 1, ...moveData },
      { type: 'add_move', moveId: 2, ...moveData },
      { type: 'select_move', moveId: 2 },
    ]);
  });
});
